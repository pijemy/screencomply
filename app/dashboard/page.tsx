"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  ClipboardList,
  Building,
  FolderKanban,
  Plus,
  Loader2,
} from "lucide-react";
import { getProjects } from "@/lib/store";
import type { ProjectRow } from "@/lib/store";
import { COUNTY_NAMES, PROJECT_TYPE_LABELS } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { getUserInitials } from "@/lib/auth-store";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const data = getProjects();
      setProjects(data);
    } catch {
      // handle gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  const activeCount = projects.filter((p) => p.status === "active").length;
  const draftCount = projects.filter((p) => p.status === "draft").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;
  const totalComplianceItems = projects.reduce((sum, p) => sum + p.checklist.length, 0);

  const recentProjects = projects.slice(0, 5);

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
            <span className="text-sm text-muted-foreground">
              {user ? (user.full_name || user.email) : "Demo User"}
            </span>
            <button
              onClick={() => signOut()}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              Sign out
            </button>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
              {user ? getUserInitials(user) : "DU"}
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
            { label: "Active Projects", value: loading ? "—" : String(activeCount), icon: FolderKanban, color: "text-blue-600" },
            { label: "Draft Projects", value: loading ? "—" : String(draftCount), icon: Shield, color: "text-green-600" },
            { label: "Completed", value: loading ? "—" : String(completedCount), icon: ClipboardList, color: "text-orange-600" },
            { label: "Compliance Items", value: loading ? "—" : String(totalComplianceItems), icon: Building, color: "text-purple-600" },
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

        {/* Recent Projects */}
        {loading ? (
          <div className="border rounded-lg p-8 text-center">
            <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : recentProjects.length === 0 ? (
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
        ) : (
          <div className="border rounded-lg">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold">Recent Projects</h3>
            </div>
            <div className="divide-y">
              {recentProjects.map((project) => {
                const required = project.checklist.filter((i) => i.required);
                const completed = required.filter((i) => i.status === "complete").length;
                const total = required.length;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="px-6 py-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {COUNTY_NAMES[project.county]} · {PROJECT_TYPE_LABELS[project.project_type]}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{pct}%</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        project.status === "active" ? "bg-green-100 text-green-800" :
                        project.status === "draft" ? "bg-yellow-100 text-yellow-800" :
                        project.status === "completed" ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="px-6 py-3 border-t">
              <Link href="/projects" className="text-sm text-primary hover:underline">
                View all projects →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}