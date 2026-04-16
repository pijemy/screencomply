"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft, CheckCircle2, Circle, Trash2, Loader2 } from "lucide-react";
import { getProject, updateChecklistItem, deleteProject } from "@/lib/store";
import type { ProjectRow } from "@/lib/store";
import { COUNTY_NAMES, PROJECT_TYPE_LABELS } from "@/lib/types";
import type { FloridaCounty, ProjectType, ComplianceChecklistItem, ChecklistItemStatus } from "@/lib/types";

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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<ProjectRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = getProject(id);
      if (!data) {
        setError("Project not found.");
      } else {
        setProject(data);
      }
    } catch {
      setError("Failed to load project.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  function handleToggleItem(itemId: string, currentStatus: ChecklistItemStatus) {
    if (!project) return;
    const newStatus: ChecklistItemStatus = currentStatus === "complete" ? "pending" : "complete";
    setUpdatingItemId(itemId);

    // Optimistic update
    setProject((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        checklist: prev.checklist.map((item) =>
          item.id === itemId
            ? {
                ...item,
                status: newStatus,
                completedAt: newStatus === "complete" ? new Date().toISOString() : undefined,
              }
            : item
        ),
      };
    });

    const result = updateChecklistItem(project.id, itemId, newStatus);
    if (!result.success) {
      // Revert on failure
      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          checklist: prev.checklist.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status: currentStatus,
                  completedAt: currentStatus === "complete" ? item.completedAt : undefined,
                }
              : item
          ),
        };
      });
    }
    setUpdatingItemId(null);
  }

  function handleDelete() {
    if (!project) return;
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    setDeleting(true);
    const result = deleteProject(project.id);
    if (result.success) {
      router.push("/projects");
    } else {
      alert(result.error || "Failed to delete project.");
      setDeleting(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
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
        <main className="container mx-auto px-4 py-8 max-w-4xl flex items-center justify-center" style={{ minHeight: "50vh" }}>
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background">
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
          <div className="border rounded-lg p-12 text-center">
            <h1 className="text-2xl font-bold mb-2">Error</h1>
            <p className="text-muted-foreground mb-6">{error || "Project not found."}</p>
            <Link
              href="/projects"
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-medium hover:bg-primary/90"
            >
              Back to Projects
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const totalRequired = project.checklist.filter((i) => i.required).length;
  const completedRequired = project.checklist.filter((i) => i.required && i.status === "complete").length;
  const pct = totalRequired > 0 ? Math.round((completedRequired / totalRequired) * 100) : 0;

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

        {/* Project header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">
              {COUNTY_NAMES[project.county as FloridaCounty]} · {PROJECT_TYPE_LABELS[project.project_type as ProjectType]} · {project.address}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(project.status)}`}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Deleting..." : "Delete Project"}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Compliance Progress</span>
            <span className="text-sm text-muted-foreground">{completedRequired}/{totalRequired} required items complete ({pct}%)</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary rounded-full h-3 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Checklist items grouped by category */}
        {Object.entries(categoryLabels).map(([category, label]) => {
          const items = project.checklist.filter((i) => i.category === category);
          if (items.length === 0) return null;

          return (
            <div key={category} className="mb-6">
              <h2 className="text-lg font-semibold mb-3">{label}</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`border-l-4 ${categoryColors[category]} border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors ${updatingItemId === item.id ? "opacity-70" : ""}`}
                    onClick={() => handleToggleItem(item.id, item.status)}
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
                          {item.status === "in_progress" && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded font-medium">
                              In Progress
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
      </main>
    </div>
  );
}