"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-6">
          <span className="text-4xl">⚠️</span>
        </div>
        <h1 className="font-mono text-4xl font-bold text-white mb-4">
          Something went wrong
        </h1>
        <p className="font-mono text-sm text-[#666] mb-8 max-w-md mx-auto">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#00ff9d] text-black font-mono font-semibold text-sm uppercase tracking-wider hover:bg-[#00cc7d] transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-[#1a1a2e] text-white font-mono font-semibold text-sm uppercase tracking-wider border border-[#333] hover:border-[#00ff9d] transition-colors"
          >
            Go Home
          </a>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left max-w-lg mx-auto">
            <p className="font-mono text-xs text-red-400 mb-2 uppercase tracking-wider">
              Error Details (Dev Only)
            </p>
            <pre className="font-mono text-xs text-red-300 overflow-auto">
              {error.message}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
