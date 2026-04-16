"use client";

import { useLocalStorage } from "@/lib/store-flag";

export function DemoBanner() {
  const isDemo = useLocalStorage();

  if (!isDemo) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-sm">
      <span className="font-medium text-amber-800">Demo Mode</span>
      <span className="text-amber-700"> — Data is stored locally in your browser. </span>
      <span className="text-amber-600">License verification uses mock data.</span>
    </div>
  );
}