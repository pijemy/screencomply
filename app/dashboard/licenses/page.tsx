"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { saveLicenseVerification, getLicenseVerifications } from "@/lib/store";
import type { LicenseVerificationRow } from "@/lib/store";
import type { LicenseStatus } from "@/lib/types";

// Mock license database for known patterns
const MOCK_LICENSES: Record<string, {
  businessName: string;
  status: LicenseStatus;
  licenseType: string;
  endorsements: string[];
  disciplinary: string[];
}> = {
  "ES0000001": {
    businessName: "ABC Screen Enclosures LLC",
    status: "active",
    licenseType: "Structure - Screen Enclosure Specialty",
    endorsements: ["Screen Enclosure", "Aluminum Structures"],
    disciplinary: [],
  },
  "ES0000002": {
    businessName: "Central Florida Screens Inc.",
    status: "active",
    licenseType: "Structure - Screen Enclosure Specialty",
    endorsements: ["Screen Enclosure"],
    disciplinary: [],
  },
  "CRC1327293": {
    businessName: "Orlando Building Solutions LLC",
    status: "active",
    licenseType: "Certified General Contractor",
    endorsements: ["General Contractor", "Building Contractor"],
    disciplinary: [],
  },
  "CRC0000001": {
    businessName: "Sunshine Contractors Group",
    status: "expired",
    licenseType: "Certified Building Contractor",
    endorsements: ["Building Contractor"],
    disciplinary: ["License suspended 2024-01-15 for insurance lapse. Reinstated 2024-03-20."],
  },
};

function getLicenseStatusColor(status: LicenseStatus): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "expired":
      return "bg-red-100 text-red-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "revoked":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getLicenseStatusDot(status: LicenseStatus): string {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "expired":
      return "bg-red-500";
    case "inactive":
      return "bg-gray-400";
    case "revoked":
      return "bg-red-500";
    case "pending":
      return "bg-yellow-500";
    default:
      return "bg-gray-400";
  }
}

export default function LicensesPage() {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<LicenseVerificationRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<LicenseVerificationRow[]>([]);

  // Load history on mount
  useState(() => {
    setHistory(getLicenseVerifications());
  });

  function validateLicenseFormat(input: string): { valid: boolean; error?: string } {
    const trimmed = input.trim().toUpperCase();
    if (!trimmed) {
      return { valid: false, error: "Please enter a license number." };
    }
    if (trimmed.length < 3) {
      return { valid: false, error: "License number is too short." };
    }
    // Valid patterns: ES prefix (screen enclosure specialty), CRC prefix (certified contractor), or numeric
    if (/^ES\d{4,}$/.test(trimmed)) return { valid: true };
    if (/^CRC\d{4,}$/.test(trimmed)) return { valid: true };
    if (/^\d{5,}$/.test(trimmed)) return { valid: true };
    // Also allow mixed format like letters + numbers
    if (/^[A-Z]{1,4}\d{4,}$/.test(trimmed)) return { valid: true };
    return { valid: false, error: "Invalid format. License numbers typically start with ES, CRC, or be numeric (e.g., ES0000001, CRC1327293)." };
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const trimmed = licenseNumber.trim().toUpperCase();
    const validation = validateLicenseFormat(trimmed);
    if (!validation.valid) {
      setError(validation.error || "Invalid license number format.");
      return;
    }

    setVerifying(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const now = new Date().toISOString();
    const mock = MOCK_LICENSES[trimmed];

    let record: LicenseVerificationRow;

    if (mock) {
      // Known mock license — return real-seeming data
      const issueDate = "2023-01-15";
      const expDate = mock.status === "expired" ? "2025-01-15" : "2027-01-15";
      record = {
        id: "",
        user_id: "",
        license_number: trimmed,
        business_name: mock.businessName,
        status: mock.status,
        license_type: mock.licenseType,
        issue_date: issueDate,
        expiration_date: expDate,
        specialty_endorsements: mock.endorsements,
        disciplinary_actions: mock.disciplinary,
        verified_at: now,
        source: "FL DBPR",
        created_at: now,
      };
    } else {
      // Unknown but valid-format license — generate a plausible mock result
      const prefix = trimmed.substring(0, 2);
      const isES = prefix === "ES";
      record = {
        id: "",
        user_id: "",
        license_number: trimmed,
        business_name: isES
          ? `Licensed Screen Contractor #${trimmed}`
          : `Licensed Contractor #${trimmed}`,
        status: "active",
        license_type: isES
          ? "Structure - Screen Enclosure Specialty"
          : "Certified General Contractor",
        issue_date: "2024-06-01",
        expiration_date: "2026-08-31",
        specialty_endorsements: isES ? ["Screen Enclosure"] : ["General Contractor"],
        disciplinary_actions: [],
        verified_at: now,
        source: "FL DBPR (Mock)",
        created_at: now,
      };
    }

    // Save to localStorage
    const saveResult = saveLicenseVerification({
      license_number: record.license_number,
      business_name: record.business_name,
      status: record.status,
      license_type: record.license_type,
      issue_date: record.issue_date,
      expiration_date: record.expiration_date,
      specialty_endorsements: record.specialty_endorsements,
      disciplinary_actions: record.disciplinary_actions,
      verified_at: record.verified_at,
      source: record.source,
    });

    if (saveResult.success) {
      record.id = saveResult.id!;
      setResult(record);
      // Refresh history
      setHistory(getLicenseVerifications());
    } else {
      // Still show the result even if save fails
      setResult(record);
    }

    setVerifying(false);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">ScreenComply</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/dashboard/licenses" className="font-medium text-foreground">
              Licenses
            </Link>
            <Link href="/dashboard/permits" className="text-muted-foreground hover:text-foreground">
              Permits
            </Link>
            <Link href="/projects" className="text-muted-foreground hover:text-foreground">
              Projects
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-2">License Verification</h1>
        <p className="text-muted-foreground mb-8">
          Enter a Florida contractor license number to verify its status, expiration date, specialty endorsements, and disciplinary actions.
        </p>

        {/* Search Form */}
        <div className="border rounded-lg p-6 mb-8">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="license" className="text-sm font-medium">
                Florida Contractor License Number
              </label>
              <div className="flex gap-3">
                <input
                  id="license"
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => { setLicenseNumber(e.target.value); setError(null); }}
                  placeholder="e.g., ES0000001, CRC1327293"
                  className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  disabled={verifying}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {verifying ? "Verifying..." : "Verify"}
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              <p className="text-xs text-muted-foreground">
                License numbers can be found on the FL DBPR website or on the contractor&apos;s business card. 
                Screen enclosure specialty licenses start with &quot;ES&quot;.
              </p>
            </div>
          </form>
        </div>

        {/* Verification Result */}
        {result && (
          <div className="border rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 ${getLicenseStatusDot(result.status)} rounded-full`}></div>
              <h2 className="font-semibold">Verification Result</h2>
              {result.source.includes("Mock") && (
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                  Mock Data
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">License Number</p>
                  <p className="font-mono font-medium">{result.license_number}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span className={`inline-flex items-center gap-1.5 ${getLicenseStatusColor(result.status)} px-2 py-0.5 rounded-full text-sm font-medium`}>
                    <span className={`w-1.5 h-1.5 ${getLicenseStatusDot(result.status)} rounded-full`}></span>
                    {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Business Name</p>
                  <p className="font-medium">{result.business_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">License Type</p>
                  <p className="font-medium">{result.license_type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{result.issue_date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expiration Date</p>
                  <p className="font-medium">{result.expiration_date}</p>
                </div>
              </div>

              {result.specialty_endorsements.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Specialty Endorsements</p>
                  <div className="flex flex-wrap gap-2">
                    {result.specialty_endorsements.map((e) => (
                      <span key={e} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">{e}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground mb-2">Disciplinary Actions</p>
                {result.disciplinary_actions.length === 0 ? (
                  <p className="text-sm text-green-600 font-medium">None on record</p>
                ) : (
                  <div className="space-y-1">
                    {result.disciplinary_actions.map((d, i) => (
                      <p key={i} className="text-sm text-red-700">{d}</p>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground">Verified at</p>
                <p className="text-sm text-muted-foreground">{result.verified_at} · Source: {result.source}</p>
              </div>
            </div>
          </div>
        )}

        {/* Verification History */}
        {history.length > 0 && (
          <div className="border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Recent Verifications</h2>
            <div className="space-y-3">
              {history.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-mono text-sm font-medium">{record.license_number}</p>
                    <p className="text-xs text-muted-foreground">{record.business_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 ${getLicenseStatusColor(record.status)} px-2 py-0.5 rounded-full text-xs font-medium`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(record.verified_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-medium text-blue-900 mb-1">About Florida Screen Enclosure Licenses</h3>
          <p className="text-xs text-blue-700">
            Florida requires a specific specialty license (ES category) for screen enclosure work. 
            This is separate from a general contractor license. Always verify the license holder has an active 
            ES endorsement before hiring or working on a project.
          </p>
        </div>
      </main>
    </div>
  );
}