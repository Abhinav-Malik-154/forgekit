"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
  size?: "sm" | "md";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "sm", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center font-mono font-semibold uppercase tracking-wider";

    const variants = {
      default: "bg-[#1a1a2e] text-[#888] border border-[#333]",
      success: "bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30",
      warning: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
      error: "bg-red-500/10 text-red-400 border border-red-500/30",
      info: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
      outline: "bg-transparent text-[#888] border border-[#333]",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[10px] rounded",
      md: "px-3 py-1 text-xs rounded-md",
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
