// ============================================
// DBPR Bulk CSV Sync
// Downloads Florida DBPR license extract CSVs, parses them,
// and builds a compact JSON index keyed by full license number.
// ============================================

import * as fs from "fs/promises";
import * as path from "path";

// --- Types ---

export interface FLLicenseRecord {
  license_number: string;
  licensee_name: string;
  license_type_code: string;
  status: string;
  expiration_date: string;
  certified_or_registered: string;
  board_code: string;
}

type LicenseIndex = Record<string, FLLicenseRecord>;

// --- Constants ---

const DBPR_BASE_URL =
  "https://www2.myfloridalicense.com/sto/file_download/extracts";
const DATA_DIR = path.resolve(process.cwd(), "data");
const INDEX_FILE = path.join(DATA_DIR, "fl-licenses.json");
const COMPACT_FILE = path.join(DATA_DIR, "fl-licenses-compact.json");

const CSV_SOURCES = [
  // Main construction license extract — covers all license types including ES, CBC, SA, CR, CRC
  { name: "CONSTRUCTIONLICENSE_1", file: "CONSTRUCTIONLICENSE_1.csv" },
] as const;

const REQUEST_TIMEOUT_MS = 60_000; // CSV downloads can be large

// --- Status mapping ---

const STATUS_FLAG_MAP: Record<string, string> = {
  A: "active",
  I: "inactive",
  V: "voluntarily_inactive",
  R: "revoked",
  D: "revoked", // deceased
  N: "inactive", // not yet active
};

// --- Helpers ---

/**
 * Parse a comma-delimited CSV line where fields are wrapped in double quotes.
 * The DBPR extract files have no headers and use `,` as the delimiter
 * with values wrapped in double quotes (RFC 4180 style).
 */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Escaped double-quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  // Push last field
  fields.push(current.trim());
  return fields;
}

/**
 * Convert MM/DD/YYYY date to YYYY-MM-DD for consistency.
 * Returns the original string if parsing fails.
 */
function normalizeDate(raw: string): string {
  if (!raw) return "";
  const match = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const [, month, day, year] = match;
    return `${year}-${month}-${day}`;
  }
  return raw;
}

/**
 * Convert a raw status flag from the CSV to our normalized string.
 * Defaults to "unknown" for unrecognized flags.
 */
function mapStatusFlag(flag: string): string {
  return STATUS_FLAG_MAP[flag.toUpperCase()] ?? "unknown";
}

/**
 * Extract the fields we care about from a parsed CSV row.
 * Returns null if the row doesn't have enough columns or
 * the license number (col 20) is missing.
 */
function extractRecord(cols: string[]): FLLicenseRecord | null {
  if (cols.length < 21) return null;

  const fullLicenseNumber = cols[20];
  if (!fullLicenseNumber) return null;

  return {
    license_number: fullLicenseNumber,
    licensee_name: cols[2] || "",
    license_type_code: cols[1] || "",
    status: mapStatusFlag(cols[14]),
    expiration_date: normalizeDate(cols[17]),
    certified_or_registered: cols[13] || "",
    board_code: cols[0] || "",
  };
}

/**
 * Download a CSV file with timeout and error handling.
 * Returns the text content or null on failure.
 */
async function downloadCsv(relativePath: string): Promise<string | null> {
  const url = `${DBPR_BASE_URL}//${relativePath}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // CILB files may not exist — that's fine
      if (response.status === 404) {
        console.log(`[DBPR CSV] ${relativePath} not found (404) — skipping`);
        return null;
      }
      console.error(
        `[DBPR CSV] Failed to download ${relativePath}: status ${response.status}`,
      );
      return null;
    }

    return await response.text();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error(`[DBPR CSV] Timeout downloading ${relativePath}`);
    } else {
      console.error(`[DBPR CSV] Error downloading ${relativePath}:`, err);
    }
    return null;
  }
}

// --- Public API ---

/**
 * Sync DBPR license data from their public CSV extracts.
 *
 * Downloads the main construction license CSV (and optional CILB CSVs),
 * parses all rows, and writes a compact JSON index to data/fl-licenses.json
 * keyed by full license number (e.g. "CBC015061").
 *
 * Only the fields we need are included in the index.
 * Existing index is fully replaced on each sync.
 */
export async function syncDBPRData(): Promise<void> {
  const index: LicenseIndex = {};

  for (const source of CSV_SOURCES) {
    console.log(`[DBPR CSV] Downloading ${source.name} (${source.file})...`);
    const csvText = await downloadCsv(source.file);
    if (!csvText) continue;

    const lines = csvText.split(/\r?\n/);
    let recordCount = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const cols = parseCsvLine(trimmed);
      const record = extractRecord(cols);
      if (!record) continue;

      index[record.license_number] = record;
      recordCount++;
    }

    console.log(
      `[DBPR CSV] ${source.name}: indexed ${recordCount} records`,
    );
  }

  const totalRecords = Object.keys(index).length;
  console.log(
    `[DBPR CSV] Total unique licenses in index: ${totalRecords}`,
  );

  // Ensure data directory exists
  await fs.mkdir(DATA_DIR, { recursive: true });

  // Write compact JSON
  const json = JSON.stringify(index);
  await fs.writeFile(INDEX_FILE, json, "utf-8");
  console.log(`[DBPR CSV] Index written to ${INDEX_FILE}`);
}

/**
 * Look up a license in the local JSON index file.
 *
 * Tries the compact format first (fl-licenses-compact.json), then falls back
 * to the full format (fl-licenses.json).
 * Returns the matching record or null if not found / file missing.
 * The index must have been built first by calling syncDBPRData().
 */
export async function lookupLicenseInLocalData(
  licenseNumber: string,
): Promise<FLLicenseRecord | null> {
  // Try compact format first
  try {
    const raw = await fs.readFile(COMPACT_FILE, "utf-8");
    const compactIndex: Record<string, string[]> = JSON.parse(raw);
    const entry = compactIndex[licenseNumber];
    if (entry) {
      return {
        license_number: licenseNumber,
        licensee_name: entry[0],
        license_type_code: entry[1],
        status: entry[2],
        expiration_date: entry[3],
        certified_or_registered: entry[4],
        board_code: "",
      };
    }
    return null;
  } catch {
    // Compact file not found — try full format
  }

  try {
    const raw = await fs.readFile(INDEX_FILE, "utf-8");
    const index: LicenseIndex = JSON.parse(raw);
    return index[licenseNumber] ?? null;
  } catch {
    // File doesn't exist or is invalid JSON — index needs to be built
    return null;
  }
}