"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-mono font-semibold uppercase tracking-wider
      transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black
    `;

    const variants = {
      primary: `
        bg-[#00ff9d] text-black
        hover:bg-[#00cc7d] hover:shadow-[0_0_20px_rgba(0,255,157,0.3)]
        focus:ring-[#00ff9d]
      `,
      secondary: `
        bg-[#1a1a2e] text-white border border-[#333]
        hover:bg-[#252540] hover:border-[#00ff9d]
        focus:ring-[#00ff9d]
      `,
      outline: `
        bg-transparent text-[#00ff9d] border border-[#00ff9d]
        hover:bg-[#00ff9d]/10
        focus:ring-[#00ff9d]
      `,
      ghost: `
        bg-transparent text-[#888]
        hover:text-white hover:bg-white/5
        focus:ring-white/20
      `,
      danger: `
        bg-red-500/20 text-red-400 border border-red-500/30
        hover:bg-red-500/30
        focus:ring-red-500
      `,
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          leftIcon
        )}
        {children}
        {rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
