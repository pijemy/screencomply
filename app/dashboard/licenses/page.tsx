"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { saveLicenseVerification, getLicenseVerifications } from "@/lib/store";
import type { LicenseVerificationRow } from "@/lib/store";
import type { LicenseStatus } from "@/lib/types";

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

function sourceLabel(source: string): { label: string; className: string } {
  switch (source) {
    case "statecred":
      return { label: "StateCred API", className: "bg-emerald-100 text-emerald-800" };
    case "dbpr_csv":
      return { label: "DBPR Records", className: "bg-blue-100 text-blue-800" };
    case "mock":
      return { label: "Mock Data", className: "bg-secondary text-secondary-foreground" };
    default:
      return { label: source, className: "bg-gray-100 text-gray-700" };
  }
}

export default function LicensesPage() {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<LicenseVerificationRow | null>(null);
  const [resultSource, setResultSource] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<LicenseVerificationRow[]>([]);

  // Load history on mount
  useState(() => {
    setHistory(getLicenseVerifications());
  });

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setResultSource("");

    const trimmed = licenseNumber.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a license number.");
      return;
    }

    setVerifying(true);

    try {
      const response = await fetch("/api/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseNumber: trimmed }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Verification failed.");
        setVerifying(false);
        return;
      }

      const license = data.license;
      const src = data.source || "mock";
      setResultSource(src);

      const record: LicenseVerificationRow = {
        id: "",
        user_id: "",
        license_number: license.licenseNumber,
        business_name: license.businessName || "Unknown",
        status: license.status || "active",
        license_type: license.licenseType || "Unknown",
        issue_date: license.issueDate || "",
        expiration_date: license.expirationDate || "",
        specialty_endorsements: license.specialtyEndorsements || [],
        disciplinary_actions: license.disciplinaryActions || [],
        verified_at: license.verifiedAt,
        source: src === "statecred" ? "StateCred API" : src === "dbpr_csv" ? "DBPR Records" : "Mock Data",
        created_at: license.verifiedAt,
      };

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
        setHistory(getLicenseVerifications());
      } else {
        setResult(record);
      }
    } catch (err) {
      setError("Verification request failed. Please try again.");
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
              {resultSource && (() => {
                const { label, className } = sourceLabel(resultSource);
                return (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${className}`}>
                    {label}
                  </span>
                );
              })()}
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
                  <p className="font-medium">{result.issue_date || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expiration Date</p>
                  <p className="font-medium">{result.expiration_date || "N/A"}</p>
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