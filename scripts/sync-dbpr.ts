#!/usr/bin/env npx tsx
// Run: npx tsx scripts/sync-dbpr.ts
// Downloads DBPR license CSVs and builds a local JSON index.
// Skips if the compact data already exists and is less than 24 hours old.

import { syncDBPRData } from "../lib/dbpr-csv-sync";
import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const COMPACT_FILE = path.join(DATA_DIR, "fl-licenses-compact.json");
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Check if compact data is recent enough
try {
  const stat = fs.statSync(COMPACT_FILE);
  const age = Date.now() - stat.mtimeMs;
  if (age < MAX_AGE_MS) {
    console.log(`DBPR data is fresh (${Math.round(age / 3600000)}h old). Skipping sync.`);
    process.exit(0);
  }
  console.log(`DBPR data is stale (${Math.round(age / 3600000)}h old). Re-syncing.`);
} catch {
  console.log("No DBPR data found. Running initial sync.");
}

console.log("Starting DBPR CSV sync...");
syncDBPRData()
  .then(async () => {
    // Build compact format
    const raw = fs.readFileSync(path.join(DATA_DIR, "fl-licenses.json"), "utf-8");
    const data = JSON.parse(raw);
    console.log(`Indexed ${Object.keys(data).length} licenses`);

    const compact: Record<string, string[]> = {};
    for (const [key, val] of Object.entries(data as Record<string, any>)) {
      compact[key] = [
        val.licensee_name || "",
        val.license_type_code || "",
        val.status || "",
        val.expiration_date || "",
        val.certified_or_registered || "",
      ];
    }

    const compactJson = JSON.stringify(compact);
    fs.writeFileSync(COMPACT_FILE, compactJson, "utf-8");
    const sizeMB = (compactJson.length / 1024 / 1024).toFixed(1);
    console.log(`Compact index written: ${sizeMB}MB`);

    // Remove the full index to save disk space
    fs.unlinkSync(path.join(DATA_DIR, "fl-licenses.json"));
    console.log("Full index removed (compact is sufficient).");

    console.log("Sync complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Sync failed:", err);
    // Exit 0 so build doesn't fail if DBPR is down
    console.log("Continuing without fresh data — will use mock fallback.");
    process.exit(0);
  });