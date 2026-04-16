import Link from "next/link";
import { Shield, FolderKanban, Plus } from "lucide-react";

export default function ProjectsPage() {
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
            <Link href="/projects" className="font-medium text-foreground">
              Projects
            </Link>
            <Link href="/projects/new" className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              New Project
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">Track compliance status across all your projects.</p>
          </div>
          <Link
            href="/projects/new"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>

        {/* Empty State */}
        <div className="border rounded-lg p-12 text-center">
          <FolderKanban className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first project to generate a compliance checklist and start tracking permits, licenses, and inspections.
          </p>
          <Link
            href="/projects/new"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Your First Project
          </Link>
        </div>
      </main>
    </div>
  );
}