"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database, LicenseStatus } from "@/lib/types";

type LicenseVerificationRow =
  Database["public"]["Tables"]["license_verifications"]["Row"];
type LicenseVerificationInsert =
  Database["public"]["Tables"]["license_verifications"]["Insert"];

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

export async function saveLicenseVerification(
  data: LicenseVerificationInsert
): Promise<{ success: boolean; id?: string; error?: string }> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();

  const insert: LicenseVerificationInsert = {
    ...data,
    user_id: userId,
  };

  const { data: record, error } = await supabase
    .from("license_verifications")
    .insert(insert)
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, id: record.id };
}

export async function getLicenseVerifications(): Promise<
  LicenseVerificationRow[]
> {
  const userId = await getAuthenticatedUserId();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("license_verifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data;
}