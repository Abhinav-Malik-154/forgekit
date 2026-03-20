"use client";

import { useState, useCallback } from "react";

interface CopyState {
  copied: boolean;
  copy: (text: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for copying text to clipboard
 * @param timeout - Time in ms before resetting copied state
 */
export function useCopyToClipboard(timeout: number = 2000): CopyState {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeout);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    },
    [timeout]
  );

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  return { copied, copy, reset };
}
