// ============================================
// DBPR Mock Data Generator
// Deterministic mock data for Florida contractor license verification.
// Same license number always returns the same mock data.
// ============================================

/**
 * Simple deterministic hash of a string to a number.
 * Uses a basic FNV-1a-like algorithm for consistency.
 */
function hashString(str: string): number {
  let hash = 2166136261; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619); // FNV prime
  }
  return hash >>> 0; // Ensure unsigned
}

/** Pick from an array deterministically based on hash. */
function pickFrom<T>(arr: T[], hash: number, offset: number): T {
  return arr[Math.abs(hash + offset) % arr.length];
}

/** Generate a deterministic number in [min, max] from hash. */
function pickNumber(min: number, max: number, hash: number, offset: number): number {
  return min + (Math.abs(hash + offset) % (max - min + 1));
}

/** Generate a deterministic month (1-12) from hash. */
function pickMonth(hash: number, offset: number): string {
  const m = pickNumber(1, 12, hash, offset);
  return m.toString().padStart(2, "0");
}

/** Generate a deterministic day (1-28 for safety) from hash. */
function pickDay(hash: number, offset: number): string {
  const d = pickNumber(1, 28, hash, offset);
  return d.toString().padStart(2, "0");
}

// --- Mock Data Pools ---

const BUSINESS_NAMES_ES = [
  "Orlando Screen Masters LLC",
  "Sunshine Screen & Aluminum Inc.",
  "Central Florida Screen Solutions",
  "Lakeworth Screen Enclosures Co.",
  "A-1 Affordable Screening LLC",
  "Goldstar Screen & Pool Enclosures",
  "Brevard Screen Builders Inc.",
  "Premier Aluminum & Screen LLC",
  "Florida Screen Crafters LLC",
  "Kissimmee Screen Pros Inc.",
  "Metro Screen & Aluminum Services",
  "Allstar Screen Enclosures LLC",
  "O-Town Screen & Shade Inc.",
  "Sunrise Screen Company LLC",
  "Patriot Screen Builders Inc.",
  "Clearwater Screening Solutions LLC",
  "Elite Enclosure Systems Inc.",
  "Sunbelt Screen & Aluminum Co.",
  "Gator Screen Pros LLC",
  "Atlantic Screen Enclosures Inc.",
];

const BUSINESS_NAMES_CG = [
  "Orlando Building Solutions LLC",
  "Central Florida Contractors Group Inc.",
  "Sunshine General Construction Co.",
  "Metro Build & Remodel LLC",
  "Florida Premier Builders Inc.",
  "Mid-State Construction LLC",
  "Orange County Builders Group",
  "Greater Orlando Contractors Inc.",
];

const BUSINESS_NAMES_SA = [
  "Orlando Aluminum Structures LLC",
  "Suncoast Aluminum & Screen Inc.",
  "Central Florida Aluminum Corp.",
  "A1 Aluminum Specialists LLC",
  "Florida Aluminum Builders Inc.",
  "Premier Aluminum Structures Co.",
];

const BUSINESS_NAMES_CR = [
  "Florida Roofing & Restoration LLC",
  "Sunshine Roofing Contractors Inc.",
  "Central Florida Roof Solutions Co.",
  "Orlando Roof Masters LLC",
  "Patriot Roofing & Construction Inc.",
];

const BUSINESS_NAMES_CRC = [
  "Sunshine Residential Contractors LLC",
  "Central Florida Home Builders Inc.",
  "Orlando Residential Construction Co.",
  "Metro Residential Builders LLC",
  "Florida Home Solutions Inc.",
];

const ORLANDO_ADDRESSES = [
  "1234 S Orange Ave, Orlando, FL 32806",
  "4560 W Colonial Dr, Orlando, FL 32808",
  "789 E Pine St, Orlando, FL 32801",
  "2100 S Semoran Blvd, Orlando, FL 32812",
  "555 N Mills Ave, Orlando, FL 32803",
  "8901 Turkey Lake Rd, Orlando, FL 32819",
  "3400 S Kirkman Rd, Orlando, FL 32819",
  "1122 N Orange Ave, Orlando, FL 32804",
  "5600 W Sand Lake Rd, Orlando, FL 32819",
  "2701 E Robinson St, Orlando, FL 32803",
  "4450 S Orange Blossom Trail, Orlando, FL 32839",
  "7800 Destination Pkwy, Orlando, FL 32819",
  "3375 S Hiawassee Rd, Orlando, FL 32818",
  "9000 Vineland Ave, Orlando, FL 32836",
  "1750 N OBT, Orlando, FL 32804",
];

const ENDORSEMENTS_ES = [
  ["Screen Enclosure", "Aluminum Structures"],
  ["Screen Enclosure"],
  ["Screen Enclosure", "Aluminum Structures", "Pool Enclosure"],
  ["Screen Enclosure", "Pool Enclosure"],
  ["Aluminum Structures", "Screen Enclosure"],
  ["Screen Enclosure", "Aluminum Structures", "Carport"],
];

const ENDORSEMENTS_CG = [
  ["General Contractor", "Building Contractor"],
  ["General Contractor"],
  ["General Contractor", "Residential Contractor"],
];

const ENDORSEMENTS_SA = [
  ["Aluminum Structures", "Screen Enclosure"],
  ["Aluminum Structures"],
  ["Aluminum Structures", "Screen Enclosure", "Carport"],
];

const ENDORSEMENTS_CR = [
  ["Roofing", "Shingle Roofing"],
  ["Roofing", "Shingle Roofing", "Tile Roofing"],
  ["Roofing"],
];

const ENDORSEMENTS_CRC = [
  ["Residential Contractor", "Building Contractor"],
  ["Residential Contractor"],
];

const DISCIPLINARY_OPTIONS = [
  [],
  [],
  [],
  [],
  [],
  [], // 6 out of 8 empty means ~75% have no disciplinary actions
  [],
  ["License suspended 2024-01-15 for insurance lapse. Reinstated 2024-03-20."],
  ["Formal reprimand issued 2023-08-10 for failure to complete continuing education requirements."],
  ["License suspended 2023-05-01 for abandonment of project. Reinstated 2023-09-15."],
  ["Citation issued 2024-02-28 for working without required permits."],
  ["Formal warning issued 2023-11-20 for advertising violations."],
];

const STATUSES: Array<{ status: "Active" | "Inactive" | "Voluntary Inactive" | "Revoked"; weight: number }> = [
  { status: "Active", weight: 75 },
  { status: "Inactive", weight: 12 },
  { status: "Voluntary Inactive", weight: 8 },
  { status: "Revoked", weight: 5 },
];

function pickStatus(hash: number): string {
  const totalWeight = STATUSES.reduce((sum, s) => sum + s.weight, 0);
  const roll = Math.abs(hash) % totalWeight;
  let cumulative = 0;
  for (const s of STATUSES) {
    cumulative += s.weight;
    if (roll < cumulative) return s.status;
  }
  return "Active";
}

// --- License type detection ---

type LicensePrefix = "ES" | "CG" | "CGC" | "SA" | "CR" | "CRC";

function detectPrefix(normalized: string): LicensePrefix | null {
  if (normalized.startsWith("CGC")) return "CGC";
  if (normalized.startsWith("CG")) return "CG";
  if (normalized.startsWith("CRC")) return "CRC";
  if (normalized.startsWith("CR")) return "CR";
  if (normalized.startsWith("ES")) return "ES";
  if (normalized.startsWith("SA")) return "SA";
  return null;
}

const LICENSE_TYPE_MAP: Record<LicensePrefix, string> = {
  ES: "Structure Aluminum/Screen Enclosure Specialty",
  CG: "Certified General Contractor",
  CGC: "Certified General Contractor",
  SA: "Structure Aluminum Specialty",
  CR: "Certified Roofing Contractor",
  CRC: "Certified Residential Contractor",
};

const ENDORSEMENTS_MAP: Record<LicensePrefix, string[][]> = {
  ES: ENDORSEMENTS_ES,
  CG: ENDORSEMENTS_CG,
  CGC: ENDORSEMENTS_CG,
  SA: ENDORSEMENTS_SA,
  CR: ENDORSEMENTS_CR,
  CRC: ENDORSEMENTS_CRC,
};

const BUSINESS_NAMES_MAP: Record<LicensePrefix, string[]> = {
  ES: BUSINESS_NAMES_ES,
  CG: BUSINESS_NAMES_CG,
  CGC: BUSINESS_NAMES_CG,
  SA: BUSINESS_NAMES_SA,
  CR: BUSINESS_NAMES_CR,
  CRC: BUSINESS_NAMES_CRC,
};

// --- Public API ---

export interface MockDBPRData {
  licenseNumber: string;
  businessName: string;
  status: string;
  licenseType: string;
  issueDate: string;
  expirationDate: string;
  specialtyEndorsements: string[];
  disciplinaryActions: string[];
  verifiedAt: string;
}

/**
 * Validate a Florida contractor license number format.
 * Returns { valid: true } or { valid: false, error: string }.
 * Normalizes to uppercase.
 */
export function validateLicenseFormat(input: string): { valid: boolean; error?: string; normalized?: string } {
  const trimmed = input.trim().toUpperCase();
  if (!trimmed) {
    return { valid: false, error: "Please enter a license number." };
  }
  // Valid prefixes and their digit counts
  const patterns: Array<{ prefix: string; regex: RegExp; label: string }> = [
    { prefix: "ES", regex: /^ES\d{7}$/, label: "ES####### (Screen Enclosure Specialty)" },
    { prefix: "CGC", regex: /^CGC\d{7}$/, label: "CGC####### (Certified General Contractor)" },
    { prefix: "CG", regex: /^CG\d{7}$/, label: "CG####### (Certified General Contractor)" },
    { prefix: "SA", regex: /^SA\d{7}$/, label: "SA####### (Structure Aluminum)" },
    { prefix: "CRC", regex: /^CRC\d{7}$/, label: "CRC####### (Certified Residential Contractor)" },
    { prefix: "CR", regex: /^CR\d{7}$/, label: "CR####### (Certified Roofing)" },
  ];

  for (const p of patterns) {
    if (trimmed.startsWith(p.prefix) && /^([A-Z])\d+$/.test(trimmed)) {
      // It starts with a valid prefix and has digits — check full match
      if (p.regex.test(trimmed)) {
        return { valid: true, normalized: trimmed };
      }
      // Partial match: starts with prefix but wrong digit count
      const digitCount = trimmed.slice(p.prefix.length).length;
      return {
        valid: false,
        error: `License format for ${p.label} requires exactly 7 digits after the prefix. Got ${digitCount} digits.`,
      };
    }
  }

  return {
    valid: false,
    error: "Invalid license format. Florida contractor licenses follow patterns like ES0000001, CG0000001, SA0000001, CR0000001, CGC0000001, or CRC0000001.",
  };
}

/**
 * Generate deterministic mock DBPR data for a license number.
 * Same license number always returns the same data.
 */
export function generateMockDBPRData(licenseNumber: string): MockDBPRData {
  const normalized = licenseNumber.trim().toUpperCase();
  const hash = hashString(normalized);
  const prefix = detectPrefix(normalized) ?? "ES";

  const businessName = pickFrom(BUSINESS_NAMES_MAP[prefix], hash, 0);
  const status = pickStatus(hash + 1);
  const licenseType = LICENSE_TYPE_MAP[prefix];
  const endorsements = pickFrom(ENDORSEMENTS_MAP[prefix], hash, 3);
  const disciplinary = pickFrom(DISCIPLINARY_OPTIONS, hash, 5);
  const address = pickFrom(ORLANDO_ADDRESSES, hash, 7);

  // Generate issue year: 2015-2024
  const issueYear = pickNumber(2015, 2024, hash, 10);
  const issueMonth = pickMonth(hash, 13);
  const issueDay = pickDay(hash, 17);
  const issueDate = `${issueYear}-${issueMonth}-${issueDay}`;

  // Expiration: 2-4 years after issue (licenses typically 2-year cycles)
  const expYearOffset = pickNumber(2, 4, hash, 20);
  const expYear = issueYear + expYearOffset;
  const expMonth = pickMonth(hash, 23);
  const expDay = pickDay(hash, 27);

  // If status is Revoked, expiration is in the past
  const expirationDate = status === "Revoked"
    ? `${issueYear + 1}-${expMonth}-${expDay}`
    : `${expYear}-${expMonth}-${expDay}`;

  return {
    licenseNumber: normalized,
    businessName: `${businessName} - ${address.split(",")[0]}`,
    status,
    licenseType,
    issueDate,
    expirationDate,
    specialtyEndorsements: [...endorsements],
    disciplinaryActions: [...disciplinary],
    verifiedAt: new Date().toISOString(),
  };
}