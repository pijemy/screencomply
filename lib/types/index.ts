// ============================================
// ScreenComply Type Definitions
// ============================================

// --- Florida Counties ---
export type FloridaCounty = "orange" | "seminole" | "osceola";

export const COUNTY_NAMES: Record<FloridaCounty, string> = {
  orange: "Orange County",
  seminole: "Seminole County",
  osceola: "Osceola County",
};

// --- Project Types ---
export type ProjectType =
  | "new_screen"
  | "rescreen"
  | "pool_enclosure"
  | "security_screen";

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  new_screen: "New Screen Enclosure",
  rescreen: "Rescreen / Screen Replacement",
  pool_enclosure: "Pool Enclosure",
  security_screen: "Security Screen Installation",
};

// --- License Status ---
export type LicenseStatus = "active" | "inactive" | "expired" | "revoked" | "pending" | "unknown";

export interface LicenseVerification {
  licenseNumber: string;
  businessName: string;
  status: LicenseStatus;
  licenseType: string;
  issueDate: string;
  expirationDate: string;
  specialtyEndorsements: string[];
  disciplinaryActions: string[];
  verifiedAt: string;
  source: string;
}

// --- Compliance Checklist Item ---
export type ChecklistCategory =
  | "license"
  | "permit"
  | "insurance"
  | "inspection"
  | "hoa";

export type ChecklistItemStatus = "pending" | "in_progress" | "complete" | "failed" | "waived";

export interface ComplianceChecklistItem {
  id: string;
  category: ChecklistCategory;
  label: string;
  description: string;
  status: ChecklistItemStatus;
  required: boolean;
  notes?: string;
  dueDate?: string;
  completedAt?: string;
}

// --- Permit Requirements ---
export interface PermitRequirement {
  county: FloridaCounty;
  permitType: string;
  description: string;
  required: boolean;
  fee: number;
  formName: string;
  formUrl?: string;
  submissionMethod: "online" | "in_person" | "mail" | "email";
  averageProcessingTime: string;
  notes?: string;
}

// --- Project ---
export interface Project {
  id: string;
  userId: string;
  name: string;
  address: string;
  county: FloridaCounty;
  projectType: ProjectType;
  checklist: ComplianceChecklistItem[];
  createdAt: string;
  updatedAt: string;
  status: "draft" | "active" | "completed" | "archived";
}

// --- Supabase Database Types ---
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company_name: string | null;
          license_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company_name?: string | null;
          license_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          company_name?: string | null;
          license_number?: string | null;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          address: string;
          county: FloridaCounty;
          project_type: ProjectType;
          status?: "draft" | "active" | "completed" | "archived";
          checklist?: ComplianceChecklistItem[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          address?: string;
          county?: FloridaCounty;
          project_type?: ProjectType;
          status?: "draft" | "active" | "completed" | "archived";
          checklist?: ComplianceChecklistItem[];
          updated_at?: string;
        };
      };
      license_verifications: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
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
          created_at?: string;
        };
        Update: {
          license_number?: string;
          business_name?: string;
          status?: LicenseStatus;
          license_type?: string;
          issue_date?: string;
          expiration_date?: string;
          specialty_endorsements?: string[];
          disciplinary_actions?: string[];
          verified_at?: string;
          source?: string;
        };
      };
    };
  };
}