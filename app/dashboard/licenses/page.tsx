import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function LicensesPage() {
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
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="license" className="text-sm font-medium">
                Florida Contractor License Number
              </label>
              <div className="flex gap-3">
                <input
                  id="license"
                  type="text"
                  placeholder="e.g., ES0000001, CRC1327293"
                  className="flex-1 px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90"
                >
                  Verify
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                License numbers can be found on the FL DBPR website or on the contractor&apos;s business card. 
                Screen enclosure specialty licenses start with &quot;ES&quot;.
              </p>
            </div>
          </form>
        </div>

        {/* Demo Result */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <h2 className="font-semibold">Demo Result</h2>
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
              Preview
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Sign up to verify real contractor licenses through the FL DBPR database. Here&apos;s what a verification looks like:
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">License Number</p>
                <p className="font-mono font-medium">ES0000001</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-sm font-medium">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  Active
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Business Name</p>
                <p className="font-medium">ABC Screen Enclosures LLC</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">License Type</p>
                <p className="font-medium">Structure - Screen Enclosure Specialty</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Issue Date</p>
                <p className="font-medium">2023-01-15</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expiration Date</p>
                <p className="font-medium">2026-01-15</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground mb-2">Specialty Endorsements</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">Screen Enclosure</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-sm">Aluminum Structures</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground mb-2">Disciplinary Actions</p>
              <p className="text-sm text-green-600 font-medium">None on record</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground">Verified at</p>
              <p className="text-sm text-muted-foreground">2026-04-16 07:00:00 UTC · Source: FL DBPR</p>
            </div>
          </div>
        </div>

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