"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  Database,
  ComplianceChecklistItem,
  ChecklistItemStatus,
  FloridaCounty,
  ProjectType,
} from "@/lib/types";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

interface CreateProjectInput {
  name: string;
  address: string;
  county: FloridaCounty;
  projectType: ProjectType;
  checklist: ComplianceChecklistItem[];
}

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user.id;
}

export async function createProject(data: CreateProjectInput): Promise<{
  success: boolean;
  projectId?: string;
  error?: string;
}> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();

  const insert: ProjectInsert = {
    user_id: userId,
    name: data.name,
    address: data.address,
    county: data.county,
    project_type: data.projectType,
    status: "draft",
    checklist: data.checklist,
  };

  const { data: project, error } = await supabase
    .from("projects")
    .insert(insert)
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, projectId: project.id };
}

export async function getProjects(): Promise<ProjectRow[]> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .neq("status", "archived")
    .order("updated_at", { ascending: false });

  if (error) {
    return [];
  }

  return data;
}

export async function getProject(id: string): Promise<ProjectRow | null> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function updateProject(
  id: string,
  data: ProjectUpdate
): Promise<{ success: boolean; error?: string }> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateChecklistItem(
  projectId: string,
  itemId: string,
  status: ChecklistItemStatus,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();

  // Fetch current project to get the checklist
  const { data: project, error: fetchError } = await supabase
    .from("projects")
    .select("checklist")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !project) {
    return { success: false, error: fetchError?.message ?? "Project not found" };
  }

  const checklist: ComplianceChecklistItem[] = project.checklist;
  const itemIndex = checklist.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return { success: false, error: "Checklist item not found" };
  }

  // Update the specific item
  checklist[itemIndex] = {
    ...checklist[itemIndex],
    status,
    ...(notes !== undefined ? { notes } : {}),
    ...(status === "complete" ? { completedAt: new Date().toISOString() } : {}),
  };

  const { error: updateError } = await supabase
    .from("projects")
    .update({
      checklist,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .eq("user_id", userId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  return { success: true };
}

export async function deleteProject(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({
      status: "archived",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}