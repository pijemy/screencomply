import Link from "next/link";
import {
  Shield,
  ClipboardList,
  Building,
  FolderKanban,
  Plus,
} from "lucide-react";

export default function DashboardPage() {
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
            <Link href="/dashboard" className="font-medium text-foreground">
              Dashboard
            </Link>
            <Link href="/dashboard/licenses" className="text-muted-foreground hover:text-foreground">
              Licenses
            </Link>
            <Link href="/dashboard/permits" className="text-muted-foreground hover:text-foreground">
              Permits
            </Link>
            <Link href="/projects/new" className="text-muted-foreground hover:text-foreground">
              New Project
            </Link>
            <Link href="/projects" className="text-muted-foreground hover:text-foreground">
              Projects
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Demo User</span>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
              DU
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back. Here&apos;s your compliance overview.
            </p>
          </div>
          <Link
            href="/projects/new"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Projects", value: "0", icon: FolderKanban, color: "text-blue-600" },
            { label: "Licenses Verified", value: "0", icon: Shield, color: "text-green-600" },
            { label: "Permits Tracked", value: "0", icon: ClipboardList, color: "text-orange-600" },
            { label: "Compliance Items", value: "0", icon: Building, color: "text-purple-600" },
          ].map((stat) => (
            <div key={stat.label} className="border rounded-lg p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/projects/new"
            className="border rounded-lg p-6 hover:shadow-md transition-shadow group"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">Start Compliance Wizard</h3>
            <p className="text-sm text-muted-foreground">
              Select your project type and county to generate a complete compliance checklist.
            </p>
          </Link>

          <Link
            href="/dashboard/licenses"
            className="border rounded-lg p-6 hover:shadow-md transition-shadow group"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Verify a License</h3>
            <p className="text-sm text-muted-foreground">
              Enter a Florida contractor license number to verify status, expiration, and endorsements.
            </p>
          </Link>

          <Link
            href="/dashboard/permits"
            className="border rounded-lg p-6 hover:shadow-md transition-shadow group"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <Building className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-1">Look Up Permits</h3>
            <p className="text-sm text-muted-foreground">
              Check permit requirements, fees, and submission methods for Orange, Seminole, and Osceola counties.
            </p>
          </Link>
        </div>

        {/* Recent Projects (empty state) */}
        <div className="border rounded-lg p-8 text-center">
          <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-1">No projects yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first project to start tracking compliance.
          </p>
          <Link
            href="/projects/new"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Your First Project
          </Link>
        </div>
      </main>
    </div>
  );
}