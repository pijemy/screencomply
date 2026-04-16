"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, FolderKanban, Plus, Loader2 } from "lucide-react";
import { getProjects } from "@/lib/store";
import type { ProjectRow } from "@/lib/store";
import type { FloridaCounty, ProjectType } from "@/lib/types";
import { COUNTY_NAMES, PROJECT_TYPE_LABELS } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = getProjects();
      setProjects(data);
    } catch {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  function getProgress(checklist: { id: string; status: string; required: boolean }[]) {
    const required = checklist.filter((i) => i.required);
    const completed = required.filter((i) => i.status === "complete");
    return { completed: completed.length, total: required.length };
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

        {loading && (
          <div className="border rounded-lg p-12 text-center">
            <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="border rounded-lg p-12 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          /* Empty State */
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
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid gap-4">
            {projects.map((project) => {
              const progress = getProgress(project.checklist);
              const pct = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="border rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {COUNTY_NAMES[project.county as FloridaCounty]} · {PROJECT_TYPE_LABELS[project.project_type as ProjectType]} · {project.address}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {progress.completed}/{progress.total} required
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated {new Date(project.updated_at).toLocaleDateString()}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}