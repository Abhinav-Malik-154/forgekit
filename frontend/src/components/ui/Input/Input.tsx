"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftElement,
      rightElement,
      type = "text",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#888] mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              "w-full bg-[#0a0a0f] border border-[#333] rounded-lg",
              "px-4 py-2.5 text-sm font-mono text-white",
              "placeholder:text-[#555]",
              "focus:outline-none focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d]",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftElement && "pl-10",
              rightElement && "pr-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs font-mono text-red-400">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs font-mono text-[#666]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
