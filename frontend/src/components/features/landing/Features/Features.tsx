"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface Module {
  id: string;
  icon: string;
  title: string;
  description: string;
  tag: string;
  color: string;
  href: string;
}

interface ModuleCardProps {
  module: Module;
  isVisible?: boolean;
}

export function ModuleCard({ module, isVisible = true }: ModuleCardProps) {
  return (
    <Link
      href={module.href}
      className={cn(
        "group relative p-6 bg-[#0d0d1a] border border-[#1a1a2e] rounded-xl",
        "transition-all duration-500",
        "hover:border-[#333] hover:shadow-xl hover:shadow-black/20",
        "hover:-translate-y-1",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      )}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${module.color}10 0%, transparent 70%)`,
        }}
      />

      {/* Tag */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="px-2 py-1 rounded text-[10px] font-mono font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: `${module.color}20`,
            color: module.color,
          }}
        >
          {module.tag}
        </span>
        <span className="text-2xl">{module.icon}</span>
      </div>

      {/* Title */}
      <h3 className="font-mono text-lg font-bold text-white mb-3 uppercase tracking-wider group-hover:text-[#00ff9d] transition-colors">
        {module.title}
      </h3>

      {/* Description */}
      <p className="font-mono text-sm text-[#888] leading-relaxed">
        {module.description}
      </p>

      {/* Arrow */}
      <div className="mt-4 flex items-center gap-2 font-mono text-xs text-[#555] group-hover:text-[#00ff9d] transition-colors">
        <span>EXPLORE</span>
        <span className="transform group-hover:translate-x-1 transition-transform">
          →
        </span>
      </div>
    </Link>
  );
}

interface FeaturesProps {
  isVisible?: boolean;
}

export function Features({ isVisible = true }: FeaturesProps) {
  const modules: Module[] = [
    {
      id: "hook-builder",
      icon: "⚡",
      title: "HOOK BUILDER",
      description:
        "Visual drag-drop composer for Uniswap V4 Hooks with real-time code generation and address mining.",
      tag: "UNISWAP V4",
      color: "#f59e0b",
      href: "/hook-builder",
    },
    {
      id: "protocol-integrator",
      icon: "🔗",
      title: "PROTOCOL INTEGRATOR",
      description:
        "Drag Aave FlashLoan, Chainlink Price Feed, and VRF blocks into your contract. Integration code appears instantly.",
      tag: "AAVE + CHAINLINK",
      color: "#06b6d4",
      href: "/protocol-integrator",
    },
    {
      id: "security-scanner",
      icon: "🛡️",
      title: "SECURITY SCANNER",
      description:
        "AI detects reentrancy, overflow, and access control vulnerabilities before you deploy. Audit report in seconds.",
      tag: "AI POWERED",
      color: "#00ff9d",
      href: "/security-scanner",
    },
    {
      id: "gas-optimizer",
      icon: "⚙️",
      title: "GAS OPTIMIZER",
      description:
        "Automatic suggestions for storage packing, function ordering, and calldata optimization.",
      tag: "OPTIMIZATION",
      color: "#a78bfa",
      href: "/gas-optimizer",
    },
  ];

  return (
    <section className="py-24 px-4 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white mb-4 uppercase tracking-wider">
            Developer Tools
          </h2>
          <p className="font-mono text-[#888] max-w-2xl mx-auto">
            Everything you need to build production-ready smart contracts
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
