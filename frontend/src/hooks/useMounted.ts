"use client";

import { useEffect, useState } from "react";

/**
 * Hook for client-side only mounting
 * Prevents hydration mismatches
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
