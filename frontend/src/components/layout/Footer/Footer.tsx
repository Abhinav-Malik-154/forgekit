"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github, Twitter } from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "bg-[#0a0a0f] border-t border-[#1a1a2e]",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-linear-to-br from-[#00ff9d] to-[#00cc7d] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">FK</span>
              </div>
              <span className="font-mono font-bold text-white text-lg tracking-wider">
                FORGEKIT
              </span>
            </Link>
            <p className="mt-4 text-sm font-mono text-[#666] max-w-md">
              The complete Web3 developer platform. Build, simulate, and deploy
              smart contracts with confidence.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-mono font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Products
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/hook-builder"
                  className="font-mono text-sm text-[#666] hover:text-[#00ff9d] transition-colors"
                >
                  Hook Builder
                </Link>
              </li>
              <li>
                <Link
                  href="/protocol-integrator"
                  className="font-mono text-sm text-[#666] hover:text-[#00ff9d] transition-colors"
                >
                  Protocol Integrator
                </Link>
              </li>
              <li>
                <Link
                  href="/security-scanner"
                  className="font-mono text-sm text-[#666] hover:text-[#00ff9d] transition-colors"
                >
                  Security Scanner
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-mono font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/docs"
                  className="font-mono text-sm text-[#666] hover:text-[#00ff9d] transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="font-mono text-sm text-[#666] hover:text-[#00ff9d] transition-colors"
                >
                  Changelog
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-[#666] hover:text-[#00ff9d] transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#1a1a2e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-[#555]">
            © {currentYear} ForgeKit. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#666] hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#666] hover:text-white transition-colors"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
