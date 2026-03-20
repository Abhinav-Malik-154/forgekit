"use client";

import { useEffect, useState } from "react";

function StarField() {
  const [stars, setStars] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      opacity: number;
      duration: number;
    }>
  >([]);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 3 + 2,
    }));
    setStars(newStars);
  }, []);

  return (
    <>
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: "#fff",
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            boxShadow: "0 0 6px #fff, 0 0 10px rgba(124,58,237,0.5)",
          }}
        />
      ))}
    </>
  );
}

interface HeroProps {
  onGetStarted?: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        <StarField />
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(0,255,157,0.08) 0%, transparent 70%)",
            left: mousePos.x - 300,
            top: mousePos.y - 300,
            transition: "left 0.3s ease-out, top 0.3s ease-out",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-full mb-8">
          <span className="w-2 h-2 bg-[#00ff9d] rounded-full animate-pulse" />
          <span className="font-mono text-xs text-[#00ff9d] uppercase tracking-wider">
            Web3 Developer Platform
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Build{" "}
          <span className="bg-gradient-to-r from-[#00ff9d] to-[#00cc7d] bg-clip-text text-transparent">
            Smarter
          </span>{" "}
          Contracts
        </h1>

        {/* Subtitle */}
        <p className="font-mono text-lg text-[#888] mb-12 max-w-2xl mx-auto">
          Visual tools for Uniswap V4 Hooks, Aave integrations, and Chainlink
          oracles. From idea to deployment in minutes.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/hook-builder"
            className="px-8 py-4 bg-[#00ff9d] text-black font-mono font-bold text-sm uppercase tracking-wider hover:bg-[#00cc7d] hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] transition-all"
          >
            Start Building →
          </a>
          <a
            href="/docs"
            className="px-8 py-4 bg-transparent text-white font-mono font-semibold text-sm uppercase tracking-wider border border-[#333] hover:border-[#00ff9d] transition-all"
          >
            Documentation
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 flex items-center justify-center gap-12 text-center">
          <div>
            <div className="font-mono text-3xl font-bold text-white">500+</div>
            <div className="font-mono text-xs text-[#666] uppercase tracking-wider">
              Hooks Deployed
            </div>
          </div>
          <div className="w-px h-12 bg-[#333]" />
          <div>
            <div className="font-mono text-3xl font-bold text-white">$2M+</div>
            <div className="font-mono text-xs text-[#666] uppercase tracking-wider">
              TVL Secured
            </div>
          </div>
          <div className="w-px h-12 bg-[#333]" />
          <div>
            <div className="font-mono text-3xl font-bold text-white">99.9%</div>
            <div className="font-mono text-xs text-[#666] uppercase tracking-wider">
              Uptime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
