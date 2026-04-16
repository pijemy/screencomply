import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function ProjectDetailPage() {
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="border rounded-lg p-12 text-center">
          <h1 className="text-2xl font-bold mb-2">Project Detail</h1>
          <p className="text-muted-foreground mb-6">
            This page will show the full project compliance tracker with checklist items, status updates, and notes.
            Sign up to save and track projects.
          </p>
          <Link
            href="/projects/new"
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90"
          >
            Create a Project
          </Link>
        </div>
      </main>
    </div>
  );
}