import type {
  FloridaCounty,
  ProjectType,
  ComplianceChecklistItem,
  ChecklistItemStatus,
  LicenseStatus,
} from "@/lib/types";

// ============================================
// localStorage-based data store for ScreenComply
// Mirrors the Supabase server action API
// ============================================

export const DEMO_USER_ID = "demo-user-001";

const PROJECTS_KEY = "screencomply_projects";
const LICENSES_KEY = "screencomply_licenses";

// --- Types (snake_case matching DB rows) ---

export interface ProjectRow {
  id: string;
  user_id: string;
  name: string;
  address: string;
  county: FloridaCounty;
  project_type: ProjectType;
  status: "draft" | "active" | "completed" | "archived";
  checklist: ComplianceChecklistItem[];
  created_at: string;
  updated_at: string;
}

export interface LicenseVerificationRow {
  id: string;
  user_id: string;
  license_number: string;
  business_name: string;
  status: LicenseStatus;
  license_type: string;
  issue_date: string;
  expiration_date: string;
  specialty_endorsements: string[];
  disciplinary_actions: string[];
  verified_at: string;
  source: string;
  created_at: string;
}

// --- Helpers ---

function generateId(): string {
  return crypto.randomUUID();
}

function getItem<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setItem<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Project CRUD ---

interface CreateProjectInput {
  name: string;
  address: string;
  county: FloridaCounty;
  projectType: ProjectType;
  checklist: ComplianceChecklistItem[];
}

export function createProject(data: CreateProjectInput): {
  success: boolean;
  projectId?: string;
  error?: string;
} {
  try {
    const projects = getItem<ProjectRow>(PROJECTS_KEY);
    const id = generateId();
    const now = new Date().toISOString();

    const project: ProjectRow = {
      id,
      user_id: DEMO_USER_ID,
      name: data.name,
      address: data.address,
      county: data.county,
      project_type: data.projectType,
      status: "draft",
      checklist: data.checklist,
      created_at: now,
      updated_at: now,
    };

    projects.push(project);
    setItem(PROJECTS_KEY, projects);

    return { success: true, projectId: id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create project",
    };
  }
}

export function getProjects(): ProjectRow[] {
  const projects = getItem<ProjectRow>(PROJECTS_KEY);
  return projects.filter((p) => p.status !== "archived").sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export function getProject(id: string): ProjectRow | null {
  const projects = getItem<ProjectRow>(PROJECTS_KEY);
  return projects.find((p) => p.id === id) ?? null;
}

export function updateProject(
  id: string,
  data: Partial<Omit<ProjectRow, "id" | "user_id" | "created_at">>
): { success: boolean; error?: string } {
  try {
    const projects = getItem<ProjectRow>(PROJECTS_KEY);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return { success: false, error: "Project not found" };
    }

    projects[index] = {
      ...projects[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    setItem(PROJECTS_KEY, projects);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update project",
    };
  }
}

export function updateChecklistItem(
  projectId: string,
  itemId: string,
  status: ChecklistItemStatus,
  notes?: string
): { success: boolean; error?: string } {
  try {
    const projects = getItem<ProjectRow>(PROJECTS_KEY);
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) {
      return { success: false, error: "Project not found" };
    }

    const project = projects[projectIndex];
    const itemIndex = project.checklist.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      return { success: false, error: "Checklist item not found" };
    }

    project.checklist[itemIndex] = {
      ...project.checklist[itemIndex],
      status,
      ...(notes !== undefined ? { notes } : {}),
      ...(status === "complete" ? { completedAt: new Date().toISOString() } : {}),
    };

    projects[projectIndex] = {
      ...project,
      updated_at: new Date().toISOString(),
    };
    setItem(PROJECTS_KEY, projects);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update checklist item",
    };
  }
}

export function deleteProject(id: string): { success: boolean; error?: string } {
  try {
    const projects = getItem<ProjectRow>(PROJECTS_KEY);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return { success: false, error: "Project not found" };
    }

    // Soft delete — mark as archived
    projects[index] = {
      ...projects[index],
      status: "archived",
      updated_at: new Date().toISOString(),
    };
    setItem(PROJECTS_KEY, projects);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete project",
    };
  }
}

// --- License Verification ---

interface SaveLicenseInput {
  license_number: string;
  business_name?: string;
  status?: LicenseStatus;
  license_type?: string;
  issue_date?: string;
  expiration_date?: string;
  specialty_endorsements?: string[];
  disciplinary_actions?: string[];
  verified_at?: string;
  source?: string;
}

export function saveLicenseVerification(
  data: SaveLicenseInput
): { success: boolean; id?: string; error?: string } {
  try {
    const licenses = getItem<LicenseVerificationRow>(LICENSES_KEY);
    const id = generateId();
    const now = new Date().toISOString();

    const record: LicenseVerificationRow = {
      id,
      user_id: DEMO_USER_ID,
      license_number: data.license_number,
      business_name: data.business_name ?? "Unknown",
      status: data.status ?? "unknown",
      license_type: data.license_type ?? "Unknown",
      issue_date: data.issue_date ?? "",
      expiration_date: data.expiration_date ?? "",
      specialty_endorsements: data.specialty_endorsements ?? [],
      disciplinary_actions: data.disciplinary_actions ?? [],
      verified_at: data.verified_at ?? now,
      source: data.source ?? "Mock DBPR",
      created_at: now,
    };

    licenses.push(record);
    setItem(LICENSES_KEY, licenses);

    return { success: true, id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to save license verification",
    };
  }
}

export function getLicenseVerifications(): LicenseVerificationRow[] {
  const licenses = getItem<LicenseVerificationRow>(LICENSES_KEY);
  return licenses.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}