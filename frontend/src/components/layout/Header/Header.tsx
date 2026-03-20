"use client";

import Link from "next/link";
import { WalletButton } from "@/components/WalletButton";
import { ChainSelector } from "@/components/ChainSelector";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant?: "default" | "minimal";
  showWallet?: boolean;
  showChainSelector?: boolean;
  className?: string;
}

export function Header({
  variant = "default",
  showWallet = true,
  showChainSelector = false,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-[#0a0a0f]/80 backdrop-blur-md",
        "border-b border-[#1a1a2e]",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00ff9d] to-[#00cc7d] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">FK</span>
            </div>
            <span className="font-mono font-bold text-white text-lg tracking-wider group-hover:text-[#00ff9d] transition-colors">
              FORGEKIT
            </span>
          </Link>

          {/* Navigation - Default variant */}
          {variant === "default" && (
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/hook-builder"
                className="font-mono text-sm text-[#888] hover:text-white transition-colors"
              >
                HOOK BUILDER
              </Link>
              <Link
                href="/protocol-integrator"
                className="font-mono text-sm text-[#888] hover:text-white transition-colors"
              >
                PROTOCOLS
              </Link>
              <Link
                href="/security-scanner"
                className="font-mono text-sm text-[#888] hover:text-white transition-colors"
              >
                SECURITY
              </Link>
              <Link
                href="/docs"
                className="font-mono text-sm text-[#888] hover:text-white transition-colors"
              >
                DOCS
              </Link>
            </nav>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4">
            {showChainSelector && <ChainSelector />}
            {showWallet && <WalletButton />}
          </div>
        </div>
      </div>
    </header>
  );
}
