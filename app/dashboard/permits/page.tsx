"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Building, ArrowLeft } from "lucide-react";
import { getAllCounties } from "@/lib/permit-data";
import { getPermitsForProject, calculateTotalFees, getRequiredPermits, getOptionalPermits } from "@/lib/permit-data";
import type { FloridaCounty, ProjectType, PermitRequirement } from "@/lib/types";
import { COUNTY_NAMES, PROJECT_TYPE_LABELS } from "@/lib/types";

type LookupResult = {
  county: FloridaCounty;
  projectType: ProjectType;
  permits: PermitRequirement[];
  totalFees: number;
};

export default function PermitsPage() {
  const counties = getAllCounties();
  const [county, setCounty] = useState<FloridaCounty>("orange");
  const [projectType, setProjectType] = useState<ProjectType>("new_screen");
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);

  function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const permits = getPermitsForProject(county, projectType);
    const totalFees = calculateTotalFees(permits);
    setLookupResult({ county, projectType, permits, totalFees });
  }

  const submissionMethodLabel: Record<string, string> = {
    online: "Online",
    in_person: "In Person",
    mail: "Mail",
    email: "Email",
  };

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
            <Link href="/dashboard/licenses" className="text-muted-foreground hover:text-foreground">
              Licenses
            </Link>
            <Link href="/dashboard/permits" className="font-medium text-foreground">
              Permits
            </Link>
            <Link href="/projects" className="text-muted-foreground hover:text-foreground">
              Projects
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-2">Permit Requirements Lookup</h1>
        <p className="text-muted-foreground mb-8">
          Select a county and project type to see all required permits, fees, forms, and submission methods.
        </p>

        {/* Lookup Form */}
        <div className="border rounded-lg p-6 mb-8">
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="county" className="text-sm font-medium">
                  County
                </label>
                <select
                  id="county"
                  value={county}
                  onChange={(e) => setCounty(e.target.value as FloridaCounty)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {counties.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="projectType" className="text-sm font-medium">
                  Project Type
                </label>
                <select
                  id="projectType"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as ProjectType)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90"
            >
              Look Up Requirements
            </button>
          </form>
        </div>

        {/* Results */}
        {!lookupResult ? (
          <div className="border rounded-lg p-12 text-center">
            <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No lookup yet</h3>
            <p className="text-sm text-muted-foreground">
              Select a county and project type above, then click &quot;Look Up Requirements&quot; to see permit details.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building className="w-5 h-5 text-orange-600" />
              {COUNTY_NAMES[lookupResult.county]} — {PROJECT_TYPE_LABELS[lookupResult.projectType]}
            </h2>

            {/* Required Permits */}
            {getRequiredPermits(lookupResult.permits).length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Required Permits</h3>
                <div className="space-y-3">
                  {getRequiredPermits(lookupResult.permits).map((permit) => (
                    <div key={permit.permitType} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{permit.permitType}</h4>
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                          Required
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{permit.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Fee</p>
                          <p className="font-medium">${permit.fee}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Submission</p>
                          <p>{submissionMethodLabel[permit.submissionMethod] || permit.submissionMethod}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Timeline</p>
                          <p>{permit.averageProcessingTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Notes</p>
                          <p className="text-xs">{permit.notes || "—"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conditional Permits */}
            {getOptionalPermits(lookupResult.permits).length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Conditional Permits</h3>
                <div className="space-y-3">
                  {getOptionalPermits(lookupResult.permits).map((permit) => (
                    <div key={permit.permitType} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{permit.permitType}</h4>
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">
                          Conditional
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{permit.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Fee</p>
                          <p className="font-medium">${permit.fee}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Submission</p>
                          <p>{submissionMethodLabel[permit.submissionMethod] || permit.submissionMethod}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Timeline</p>
                          <p>{permit.averageProcessingTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Notes</p>
                          <p className="text-xs">{permit.notes || "—"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Fees */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-amber-900 mb-1">Total Required Fees</h3>
              <p className="text-2xl font-bold text-amber-900">${lookupResult.totalFees}</p>
              {getOptionalPermits(lookupResult.permits).length > 0 && (
                <p className="text-xs text-amber-700 mt-1">
                  Additional conditional fees: ${getOptionalPermits(lookupResult.permits).reduce((s, p) => s + p.fee, 0)}.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}