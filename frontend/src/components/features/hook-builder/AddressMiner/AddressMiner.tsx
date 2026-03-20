"use client";

import { cn } from "@/lib/utils";
import type { MiningStatus } from "@/types";

interface AddressMinerProps {
  status: MiningStatus;
  address: string | null;
  progress: number;
  attempts: number;
  timeMs: number;
  onCopy: () => void;
  copyText: string;
}

export function AddressMiner({
  status,
  address,
  progress,
  attempts,
  timeMs,
  onCopy,
  copyText,
}: AddressMinerProps) {
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatAttempts = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="p-4 bg-[#0a0a0f] border border-[#1a1a2e] rounded-lg">
      <h4 className="font-mono text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">
        Address Mining
      </h4>

      {/* Progress Bar */}
      <div className="relative h-2 bg-[#1a1a2e] rounded-full overflow-hidden mb-3">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
            status === "found" ? "bg-[#00ff9d]" : "bg-[#f59e0b]"
          )}
          style={{ width: `${progress}%` }}
        />
        {status === "mining" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        )}
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-xs text-[#888]">
          {status === "idle" && "Select hooks to start mining"}
          {status === "mining" && "Mining valid address..."}
          {status === "found" && "Valid address found!"}
        </span>
        <span className="font-mono text-xs text-[#555]">
          {status !== "idle" && `${formatAttempts(attempts)} attempts`}
        </span>
      </div>

      {/* Time */}
      {status !== "idle" && (
        <div className="text-right mb-3">
          <span className="font-mono text-xs text-[#555]">
            Time: {formatTime(timeMs)}
          </span>
        </div>
      )}

      {/* Mined Address */}
      {address && (
        <div className="flex items-center gap-2 p-3 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-md">
          <code className="flex-1 font-mono text-xs text-[#00ff9d] truncate">
            {address}
          </code>
          <button
            onClick={onCopy}
            className="px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30 rounded hover:bg-[#00ff9d]/30 transition-colors"
          >
            {copyText}
          </button>
        </div>
      )}
    </div>
  );
}
