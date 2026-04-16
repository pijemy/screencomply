// Determines whether to use localStorage or Supabase.
// When Supabase URL is placeholder, we use localStorage.

export function useLocalStorage(): boolean {
  if (typeof window === "undefined") {
    // SSR: check env var
    return (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    );
  }
  // Client: check env var (available via Next.js runtime config)
  return (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
  );
}