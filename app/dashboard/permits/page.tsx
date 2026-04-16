import Link from "next/link";
import { Shield, Building, ArrowLeft } from "lucide-react";
import { getAllCounties } from "@/lib/permit-data";

export default function PermitsPage() {
  const counties = getAllCounties();

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
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="county" className="text-sm font-medium">
                  County
                </label>
                <select
                  id="county"
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
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="new_screen">New Screen Enclosure</option>
                  <option value="rescreen">Rescreen / Screen Replacement</option>
                  <option value="pool_enclosure">Pool Enclosure</option>
                  <option value="security_screen">Security Screen Installation</option>
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

        {/* Demo Results */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Building className="w-5 h-5 text-orange-600" />
            Orange County — New Screen Enclosure
          </h2>
          
          <div className="text-sm text-muted-foreground mb-4">
            Showing demo data. Sign up to get real-time permit requirements for your projects.
          </div>

          {[
            {
              type: "Building Permit - Screen Enclosure",
              required: true,
              fee: "$125",
              method: "Online",
              timeline: "5-10 business days",
              notes: "Submit via Orange County Permitting Portal. Two sets of sealed plans required.",
            },
            {
              type: "Zoning Clearance",
              required: true,
              fee: "$50",
              method: "Online",
              timeline: "3-5 business days",
              notes: "Must be approved before building permit.",

            },
            {
              type: "Wind Load Certification",
              required: true,
              fee: "$0",
              method: "In person",
              timeline: "Included with building permit review",
              notes: "Prepared by FL-licensed engineer. Orange County = 130 mph wind zone.",
            },
            {
              type: "Electrical Permit",
              required: false,
              fee: "$75",
              method: "Online",
              timeline: "3-5 business days",
              notes: "Only needed if the enclosure includes fans, lights, or outlets.",
            },
          ].map((permit) => (
            <div key={permit.type} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{permit.type}</h3>
                {permit.required ? (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                    Required
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    Conditional
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Fee</p>
                  <p className="font-medium">{permit.fee}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submission</p>
                  <p>{permit.method}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Timeline</p>
                  <p>{permit.timeline}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="text-xs">{permit.notes}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-amber-900 mb-1">Total Required Fees</h3>
            <p className="text-2xl font-bold text-amber-900">$175</p>
            <p className="text-xs text-amber-700 mt-1">
              Building permit ($125) + Zoning clearance ($50) + Wind load certification ($0). 
              Additional $75 if electrical permit is needed.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}