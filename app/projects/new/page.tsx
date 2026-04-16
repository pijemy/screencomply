"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, ArrowLeft, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { FloridaCounty, ProjectType, COUNTY_NAMES, PROJECT_TYPE_LABELS, ComplianceChecklistItem } from "@/lib/types";
import { getPermitsForProject, calculateTotalFees } from "@/lib/permit-data";

function generateChecklist(
  county: FloridaCounty,
  projectType: ProjectType
): ComplianceChecklistItem[] {
  const permits = getPermitsForProject(county, projectType);
  const countyName = COUNTY_NAMES[county];
  const projectName = PROJECT_TYPE_LABELS[projectType];

  const items: ComplianceChecklistItem[] = [];

  // License items
  items.push({
    id: "license-verify",
    category: "license",
    label: "Verify Contractor License",
    description: `Confirm the contractor holds a valid Florida screen enclosure specialty license (ES category). Check expiration date and endorsements on FL DBPR.`,
    status: "pending",
    required: true,
  });

  items.push({
    id: "license-es-endorsement",
    category: "license",
    label: "ES Specialty Endorsement",
    description: "Ensure the license includes the Screen Enclosure specialty endorsement. A general contractor license alone is not sufficient for screen work.",
    status: "pending",
    required: true,
  });

  items.push({
    id: "insurance-gl",
    category: "insurance",
    label: "General Liability Insurance ($1M minimum)",
    description: `${countyName} requires a minimum of $1,000,000 general liability coverage for screen enclosure work. Verify no screen exclusions in the policy.`,
    status: "pending",
    required: true,
  });

  items.push({
    id: "insurance-wc",
    category: "insurance",
    label: "Workers' Compensation Insurance",
    description: "Required if the contractor has employees. Exempt only for sole proprietors with no employees.",
    status: "pending",
    required: true,
  });

  items.push({
    id: "insurance-screen-exclusion",
    category: "insurance",
    label: "Verify No Screen Exclusion",
    description: "Many Florida liability policies exclude screen enclosure work. Verify the GL policy specifically covers screen and aluminum structures with no exclusion riders.",
    status: "pending",
    required: true,
    notes: "CRITICAL: Screen exclusions are common in Florida GL policies. Read the actual policy, not just the certificate.",
  });

  // Permit items — generated from permit data
  permits.forEach((permit, index) => {
    if (permit.required) {
      items.push({
        id: `permit-${index}`,
        category: "permit",
        label: permit.permitType,
        description: permit.description + (permit.notes ? ` ${permit.notes}` : ""),
        status: "pending",
        required: permit.required,
        notes: `Fee: $${permit.fee} · Submit via: ${permit.submissionMethod} · Timeline: ${permit.averageProcessingTime}`,
      });
    } else {
      items.push({
        id: `permit-optional-${index}`,
        category: "permit",
        label: permit.permitType,
        description: permit.description + (permit.notes ? ` ${permit.notes}` : ""),
        status: "pending",
        required: false,
        notes: `Conditional. Fee: $${permit.fee} · Submit via: ${permit.submissionMethod} · Timeline: ${permit.averageProcessingTime}`,
      });
    }
  });

  // Inspection items
  items.push({
    id: "inspection-foundation",
    category: "inspection",
    label: "Foundation Inspection",
    description: "Schedule foundation inspection after the slab/footers are complete and before any structural erection begins.",
    status: "pending",
    required: true,
  });

  items.push({
    id: "inspection-final",
    category: "inspection",
    label: "Final Inspection",
    description: "Final structural and safety inspection after all work is complete. Inspector will verify wind load compliance.",
    status: "pending",
    required: true,
  });

  // HOA item
  items.push({
    id: "hoa-approval",
    category: "hoa",
    label: "HOA / Community Approval",
    description: `Many ${countyName} communities require HOA architectural review board approval before permit submission. Check with the property owner's HOA.`,
    status: "pending",
    required: false,
    notes: "HOA approval timelines vary from 2-8 weeks. Start this process EARLY — some HOAs require it before permit application.",
  });

  return items;
}

const STEPS = ["Project Details", "Review Checklist", "Save Project"];

export default function NewProjectPage() {
  const [step, setStep] = useState(0);
  const [county, setCounty] = useState<FloridaCounty>("orange");
  const [projectType, setProjectType] = useState<ProjectType>("new_screen");
  const [projectName, setProjectName] = useState("");
  const [address, setAddress] = useState("");
  const [checklist, setChecklist] = useState<ComplianceChecklistItem[]>([]);

  function handleGenerateChecklist() {
    const items = generateChecklist(county, projectType);
    setChecklist(items);
    setStep(1);
  }

  function toggleItem(id: string) {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "complete" ? "pending" : "complete",
              completedAt: item.status === "complete" ? undefined : new Date().toISOString(),
            }
          : item
      )
    );
  }

  const totalFees = calculateTotalFees(
    getPermitsForProject(county, projectType)
  );
  const completedCount = checklist.filter((i) => i.status === "complete").length;
  const totalRequired = checklist.filter((i) => i.required).length;
  const completedRequired = checklist.filter((i) => i.required && i.status === "complete").length;

  const categoryLabels: Record<string, string> = {
    license: "📋 License & Insurance",
    permit: "🏛️ Permits",
    inspection: "🔍 Inspections",
    hoa: "🏠 HOA & Community",
  };

  const categoryColors: Record<string, string> = {
    license: "border-l-green-500",
    permit: "border-l-blue-500",
    inspection: "border-l-orange-500",
    hoa: "border-l-purple-500",
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
            <Link href="/projects" className="text-muted-foreground hover:text-foreground">
              Projects
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`text-sm ${
                  i <= step ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className="w-12 h-px bg-border mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Project Details */}
        {step === 0 && (
          <div className="border rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-2">New Project</h1>
            <p className="text-muted-foreground mb-6">
              Tell us about your project and we&apos;ll generate a complete compliance checklist.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="projectName" className="text-sm font-medium">
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  placeholder="e.g., Johnson Residence Screen Enclosure"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Project Address
                </label>
                <input
                  id="address"
                  type="text"
                  placeholder="e.g., 1234 Main St, Orlando, FL 32801"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

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
                    {Object.entries(COUNTY_NAMES).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
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

              {/* Estimated Fees */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-amber-900 mb-1">Estimated Permit Fees</h3>
                <p className="text-2xl font-bold text-amber-900">${totalFees}</p>
                <p className="text-xs text-amber-700 mt-1">
                  Based on {COUNTY_NAMES[county]} requirements for {PROJECT_TYPE_LABELS[projectType].toLowerCase()} projects.
                  Actual fees may vary.
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleGenerateChecklist}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 flex items-center gap-2"
              >
                Generate Checklist
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review Checklist */}
        {step === 1 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">{projectName || "Project"}</h1>
                <p className="text-muted-foreground">
                  {COUNTY_NAMES[county]} · {PROJECT_TYPE_LABELS[projectType]}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">
                  {completedRequired}/{totalRequired} required
                </p>
              </div>
            </div>

            <div className="w-full bg-muted rounded-full h-2 mb-8">
              <div
                className="bg-primary rounded-full h-2 transition-all"
                style={{ width: `${totalRequired > 0 ? (completedRequired / totalRequired) * 100 : 0}%` }}
              />
            </div>

            {/* Checklist items grouped by category */}
            {Object.entries(categoryLabels).map(([category, label]) => {
              const items = checklist.filter((i) => i.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">{label}</h2>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`border-l-4 ${categoryColors[category]} border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors`}
                        onClick={() => toggleItem(item.id)}
                      >
                        <div className="flex items-start gap-3">
                          {item.status === "complete" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3
                                className={`font-medium ${
                                  item.status === "complete" ? "line-through text-muted-foreground" : ""
                                }`}
                              >
                                {item.label}
                              </h3>
                              {item.required ? (
                                <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded font-medium">
                                  Required
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded font-medium">
                                  Conditional
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                            {item.notes && (
                              <p className="text-xs text-amber-700 bg-amber-50 rounded p-2 mt-2">
                                💡 {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(0)}
                className="border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-accent flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 flex items-center gap-2"
              >
                Save Project
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Save Confirmation */}
        {step === 2 && (
          <div className="border rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Project Created!</h1>
            <p className="text-muted-foreground mb-6">
              {projectName || "Project"} has been saved with {checklist.length} checklist items.
            </p>

            <div className="bg-secondary rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <h3 className="font-medium mb-2">Summary</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">County:</span> {COUNTY_NAMES[county]}</p>
                <p><span className="text-muted-foreground">Type:</span> {PROJECT_TYPE_LABELS[projectType]}</p>
                <p><span className="text-muted-foreground">Address:</span> {address || "Not specified"}</p>
                <p><span className="text-muted-foreground">Total items:</span> {checklist.length}</p>
                <p><span className="text-muted-foreground">Required:</span> {checklist.filter((i) => i.required).length}</p>
                <p><span className="text-muted-foreground">Est. permit fees:</span> ${totalFees}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-700">
              <strong>Note:</strong> Sign up to save projects permanently and track your compliance progress over time. 
              This demo shows the full checklist workflow.
            </div>

            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-accent"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => {
                  setStep(0);
                  setChecklist([]);
                  setProjectName("");
                  setAddress("");
                }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
              >
                Create Another Project
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}