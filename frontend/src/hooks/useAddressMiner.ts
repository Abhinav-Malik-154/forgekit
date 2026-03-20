"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { MiningStatus } from "@/types";

interface AddressMinerState {
  status: MiningStatus;
  progress: number;
  attempts: number;
  address: string | null;
  timeMs: number;
}

interface UseAddressMinerReturn extends AddressMinerState {
  startMining: (permissionBits: string) => void;
  stopMining: () => void;
  reset: () => void;
}

/**
 * Hook for mining vanity addresses with specific permission bits
 */
export function useAddressMiner(): UseAddressMinerReturn {
  const [state, setState] = useState<AddressMinerState>({
    status: "idle",
    progress: 0,
    attempts: 0,
    address: null,
    timeMs: 0,
  });

  const workerRef = useRef<Worker | null>(null);
  const startTimeRef = useRef<number>(0);

  const startMining = useCallback((permissionBits: string) => {
    // Terminate existing worker
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    setState({
      status: "mining",
      progress: 0,
      attempts: 0,
      address: null,
      timeMs: 0,
    });

    startTimeRef.current = Date.now();

    // Create new worker
    workerRef.current = new Worker(
      new URL("@/lib/workers/addressMiner.worker.ts", import.meta.url)
    );

    workerRef.current.onmessage = (e) => {
      const { type, address, attempts } = e.data;

      if (type === "progress") {
        setState((prev) => ({
          ...prev,
          progress: Math.min((attempts / 1000000) * 100, 99),
          attempts,
        }));
      } else if (type === "found") {
        const timeMs = Date.now() - startTimeRef.current;
        setState({
          status: "found",
          progress: 100,
          attempts,
          address,
          timeMs,
        });
        workerRef.current?.terminate();
        workerRef.current = null;
      }
    };

    workerRef.current.postMessage({ permissionBits });
  }, []);

  const stopMining = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      status: "idle",
    }));
  }, []);

  const reset = useCallback(() => {
    stopMining();
    setState({
      status: "idle",
      progress: 0,
      attempts: 0,
      address: null,
      timeMs: 0,
    });
  }, [stopMining]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  return {
    ...state,
    startMining,
    stopMining,
    reset,
  };
}
