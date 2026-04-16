// ============================================
// localStorage-based auth store for ScreenComply
// Used in demo mode when Supabase isn't configured
// ============================================

const AUTH_KEY = "screencomply_auth_user";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  company_name: string | null;
  license_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  company_name?: string;
  license_number?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

// --- Helpers ---

function generateId(): string {
  return crypto.randomUUID();
}

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: AuthUser | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
  // Dispatch a storage event so onAuthChange listeners fire in other tabs
  window.dispatchEvent(new StorageEvent("storage", { key: AUTH_KEY }));
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// --- Auth functions (mirrors server action API) ---

export function login(email: string, _password: string): AuthResult {
  // In demo mode, accept any email/password
  const existingUser = getStoredUser();
  if (existingUser && existingUser.email === email) {
    // Already logged in as this user, just return success
    return { success: true };
  }

  const now = new Date().toISOString();
  const user: AuthUser = {
    id: generateId(),
    email,
    full_name: email.split("@")[0],
    company_name: null,
    license_number: null,
    created_at: now,
    updated_at: now,
  };

  setStoredUser(user);
  return { success: true };
}

export function signup(data: SignupData): AuthResult {
  const now = new Date().toISOString();
  const user: AuthUser = {
    id: generateId(),
    email: data.email,
    full_name: data.full_name,
    company_name: data.company_name ?? null,
    license_number: data.license_number ?? null,
    created_at: now,
    updated_at: now,
  };

  setStoredUser(user);
  return { success: true };
}

export function signOut(): AuthResult {
  setStoredUser(null);
  return { success: true };
}

export function getUser(): AuthUser | null {
  return getStoredUser();
}

export function onAuthChange(
  callback: (user: AuthUser | null) => void
): () => void {
  // Listen for storage events (fires across tabs)
  const handler = (e: StorageEvent) => {
    if (e.key === AUTH_KEY || e.key === null) {
      callback(getStoredUser());
    }
  };
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener("storage", handler);
  };
}

// Utility to get display initials from a user
export function getUserInitials(user: AuthUser): string {
  if (user.full_name) {
    return getInitials(user.full_name);
  }
  return getInitials(user.email);
}