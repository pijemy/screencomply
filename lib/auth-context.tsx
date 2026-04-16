"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useLocalStorage } from "@/lib/store-flag";
import * as authStore from "@/lib/auth-store";
import type { AuthUser, SignupData, AuthResult } from "@/lib/auth-store";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (data: SignupData) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Dynamic import helper for Supabase server actions
async function supabaseLogin(
  email: string,
  password: string
): Promise<AuthResult> {
  const { loginWithEmail } = await import("@/app/actions/auth");
  return loginWithEmail(email, password);
}

async function supabaseSignup(data: SignupData): Promise<AuthResult> {
  const { signupWithEmail } = await import("@/app/actions/auth");
  return signupWithEmail(
    data.email,
    data.password,
    data.full_name,
    data.company_name,
    data.license_number
  );
}

async function supabaseSignOut(): Promise<AuthResult> {
  const { signOut: signOutAction } = await import("@/app/actions/auth");
  return signOutAction();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = useLocalStorage();

  // Read initial user from auth store on mount
  useEffect(() => {
    if (isDemo) {
      const stored = authStore.getUser();
      setUser(stored);
      setLoading(false);
    } else {
      // In Supabase mode, we rely on server-side session.
      // For now, mark loading as done; Supabase auth state
      // will be handled by middleware + server actions.
      setUser(null);
      setLoading(false);
    }
  }, [isDemo]);

  // Listen for auth changes in demo mode (e.g. sign-out in another tab)
  useEffect(() => {
    if (!isDemo) return;
    const unsubscribe = authStore.onAuthChange((updatedUser) => {
      setUser(updatedUser);
    });
    return unsubscribe;
  }, [isDemo]);

  const loginFn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (isDemo) {
        const result = authStore.login(email, password);
        if (result.success) {
          setUser(authStore.getUser());
        }
        return result;
      }
      const result = await supabaseLogin(email, password);
      // Refresh user state after Supabase login
      if (result.success) {
        // Supabase session is managed server-side; reload to pick it up
        window.location.reload();
      }
      return result;
    },
    [isDemo]
  );

  const signupFn = useCallback(
    async (data: SignupData): Promise<AuthResult> => {
      if (isDemo) {
        const result = authStore.signup(data);
        if (result.success) {
          setUser(authStore.getUser());
        }
        return result;
      }
      return supabaseSignup(data);
    },
    [isDemo]
  );

  const signOutFn = useCallback(async (): Promise<AuthResult> => {
    if (isDemo) {
      const result = authStore.signOut();
      if (result.success) {
        setUser(null);
      }
      return result;
    }
    const result = await supabaseSignOut();
    if (result.success) {
      window.location.href = "/login";
    }
    return result;
  }, [isDemo]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: loginFn,
        signup: signupFn,
        signOut: signOutFn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}