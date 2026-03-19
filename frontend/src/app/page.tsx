"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { WalletButton } from "@/components/WalletButton";
import { ChainSelector } from "@/components/ChainSelector";

const monoFont = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace";

// Hook for scroll-triggered animations
function useScrollAnimation() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return visibleSections;
}

// Animated counter hook
function useCounter(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);
  
  return count;
}

// Star/particle component
function StarField() {
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number, duration: number}>>([]);
  
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
          className="star"
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: '#fff',
            borderRadius: '50%',
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            boxShadow: '0 0 6px #fff, 0 0 10px rgba(124,58,237,0.5)',
          }}
        />
      ))}
    </>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const visibleSections = useScrollAnimation();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const modules = [
    {
      id: "hook-builder",
      icon: "⚡",
      title: "HOOK BUILDER",
      description: "Visual drag-drop composer for Uniswap V4 Hooks with real-time code generation and address mining.",
      tag: "UNISWAP V4",
      color: "#f59e0b",
      href: "/hook-builder",
    },
    {
      id: "protocol-integrator",
      icon: "🔗",
      title: "PROTOCOL INTEGRATOR",
      description: "Drag Aave FlashLoan, Chainlink Price Feed, and VRF blocks into your contract. Integration code appears instantly.",
      tag: "AAVE + CHAINLINK",
      color: "#06b6d4",
      href: "/protocol-integrator",
    },
    {
      id: "security-scanner",
      icon: "🛡️",
      title: "SECURITY SCANNER",
      description: "AI detects reentrancy, overflow, and access control vulnerabilities before you deploy. Audit report in seconds.",
      tag: "AI POWERED",
      color: "#00ff9d",
      href: "/security-scanner",
    },
    {
      id: "gas-optimizer",
      icon: "🔥",
      title: "GAS OPTIMIZER",
      description: "Analyze any contract for gas inefficiencies. See exact savings per function with before and after estimates.",
      tag: "SAVE GAS",
      color: "#a78bfa",
      href: "/gas-optimizer",
    },
  ];

  const pipelineSteps = [
    { icon: "📝", label: "COMPOSE" },
    { icon: "⚡", label: "GENERATE" },
    { icon: "🛡️", label: "SCAN" },
    { icon: "⛽", label: "OPTIMIZE" },
    { icon: "🚀", label: "DEPLOY" },
  ];

  const techStack = [
    { name: "UNISWAP V4", color: "#f59e0b" },
    { name: "AAVE V3", color: "#06b6d4" },
    { name: "CHAINLINK", color: "#06b6d4" },
    { name: "OPENZEPPELIN", color: "#00ff9d" },
    { name: "FOUNDRY", color: "#e2e8f0" },
    { name: "ERC-7702", color: "#a78bfa" },
    { name: "ERC-721", color: "#a78bfa" },
    { name: "POLYGON", color: "#7c3aed" },
    { name: "BASE", color: "#e2e8f0" },
    { name: "ARBITRUM", color: "#e2e8f0" },
    { name: "NEXT.JS 15", color: "#e2e8f0" },
    { name: "WAGMI V2", color: "#e2e8f0" },
  ];

  return (
    <div style={{ fontFamily: monoFont, background: '#050508', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* ═══════════════════════════════════════════════════════════════════════════
          ANIMATED BACKGROUND - IMPRESSIVE COSMIC EFFECT
      ═══════════════════════════════════════════════════════════════════════════ */}
      <div className="animated-bg" style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        {/* Starfield */}
        {mounted && <StarField />}
        
        {/* Animated aurora/northern lights effect */}
        <div 
          className="aurora"
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(124,58,237,0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, rgba(0,255,157,0.1) 0%, transparent 50%)
            `,
            animation: 'auroraMove 15s ease-in-out infinite',
            transform: `translate(${mousePos.x * 0.01}px, ${mousePos.y * 0.01}px)`,
          }}
        />
        
        {/* Glowing orb that follows cursor */}
        <div 
          className="cursor-glow"
          style={{
            position: 'fixed',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(124,58,237,0.05) 40%, transparent 70%)',
            left: mousePos.x - 200,
            top: mousePos.y - 200,
            pointerEvents: 'none',
            transition: 'left 0.15s ease-out, top 0.15s ease-out',
            filter: 'blur(1px)',
          }}
        />
        
        {/* Animated gradient mesh */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.4,
            background: `
              conic-gradient(from ${scrollY * 0.1}deg at 50% 50%, 
                transparent 0deg, 
                rgba(124,58,237,0.03) 60deg, 
                transparent 120deg, 
                rgba(0,255,157,0.03) 180deg, 
                transparent 240deg,
                rgba(6,182,212,0.03) 300deg,
                transparent 360deg
              )
            `,
          }}
        />
        
        {/* Floating geometric shapes */}
        {mounted && [...Array(6)].map((_, i) => (
          <div
            key={`shape-${i}`}
            style={{
              position: 'absolute',
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              border: `1px solid ${['#7c3aed20', '#00ff9d15', '#06b6d415'][i % 3]}`,
              borderRadius: i % 2 === 0 ? '50%' : '0',
              left: `${10 + i * 15}%`,
              top: `${20 + (i * 12) % 60}%`,
              animation: `floatShape ${10 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              transform: `rotate(${i * 15}deg)`,
            }}
          />
        ))}
        
        {/* Grid with perspective */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '-50%',
          width: '200%',
          height: '50%',
          backgroundImage: `
            linear-gradient(rgba(124,58,237,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 80%)',
          animation: 'gridScroll 20s linear infinite',
        }} />

        {/* Scan line effect */}
        <div 
          className="scanline"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(0,255,157,0.5), transparent)',
            animation: 'scanline 4s ease-in-out infinite',
            boxShadow: '0 0 20px rgba(0,255,157,0.3)',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════════════════════════════════ */}
      <nav 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: '64px',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1a1a2e',
          fontFamily: monoFont,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            
            {/* Left - Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '16px' }}>FORGEKIT</span>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                color: '#00ff9d', 
                fontSize: '11px',
              }}>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: '#00ff9d',
                  animation: 'pulse 2s infinite',
                }} />
                LIVE
              </span>
            </div>

            {/* Center - Nav Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }} className="hidden lg:flex">
              {["HOOK BUILDER", "PROTOCOL INTEGRATOR", "SECURITY SCANNER", "GAS OPTIMIZER"].map((item) => (
                <Link 
                  key={item} 
                  href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                  style={{ 
                    color: '#94a3b8', 
                    fontSize: '12px', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Right - Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ChainSelector />
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section style={{ 
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        fontFamily: monoFont,
        zIndex: 1,
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 45%, rgba(124,58,237,0.12) 0%, transparent 65%)',
          pointerEvents: 'none',
          animation: 'pulseGlow 4s ease-in-out infinite',
        }} />

        <div style={{ 
          maxWidth: '1152px', 
          margin: '0 auto', 
          padding: '0 32px',
          width: '100%',
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease',
        }}>
          <div style={{ maxWidth: '700px' }}>
            
            {/* Terminal prompt */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '24px',
            }}>
              <span style={{ color: '#00ff9d', fontSize: '16px' }}>&gt;</span>
              <span style={{ color: '#00ff9d', fontSize: '16px' }}>
                FORGEKIT v1.0.0 — UNIVERSAL WEB3 DEVELOPER PLATFORM
              </span>
              <span className="cursor-blink" style={{ color: '#00ff9d', fontSize: '16px' }}>_</span>
            </div>

            {/* Main heading */}
            <h1 style={{ margin: 0, lineHeight: 1 }}>
              <span style={{ 
                display: 'block',
                color: '#e2e8f0', 
                fontSize: 'clamp(48px, 8vw, 80px)', 
                fontWeight: 800,
              }}>
                BUILD. DEPLOY.
              </span>
              <span style={{ 
                display: 'block',
                color: '#00ff9d', 
                fontSize: 'clamp(48px, 8vw, 80px)', 
                fontWeight: 800,
              }}>
                DOMINATE WEB3.
              </span>
            </h1>

            {/* Comment lines */}
            <div style={{ marginTop: '24px', color: '#94a3b8', fontSize: '15px', lineHeight: 1.7 }}>
              <p style={{ margin: 0 }}>// Complete toolkit for Uniswap V4 Hooks, Aave + Chainlink integrations,</p>
              <p style={{ margin: 0 }}>// AI security scanning, and gas optimization. All in one platform.</p>
            </div>

            {/* System status terminal - glassmorphism style */}
            <div 
              className="terminal-card"
              style={{ 
                marginTop: '32px',
                display: 'inline-block',
                background: 'rgba(15, 15, 20, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                borderRadius: '4px',
                padding: '24px 28px',
                minWidth: '420px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 60px rgba(124, 58, 237, 0.05)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Animated border glow */}
              <div style={{
                position: 'absolute',
                inset: -1,
                background: 'linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.5), transparent)',
                animation: 'borderGlow 3s linear infinite',
                opacity: 0.5,
                pointerEvents: 'none',
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  marginBottom: '16px',
                }}>
                  <span style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    background: '#00ff9d',
                    animation: 'pulse 2s infinite',
                    boxShadow: '0 0 10px #00ff9d, 0 0 20px rgba(0, 255, 157, 0.5)',
                  }} />
                  <span style={{ 
                    color: '#00ff9d', 
                    fontSize: '13px', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontWeight: 'bold',
                  }}>
                    SYSTEM STATUS
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
                  <div style={{ display: 'flex' }} className="typing-line">
                    <span style={{ width: '120px', color: '#64748b' }}>[MODULES]</span>
                    <span style={{ color: '#f59e0b', textShadow: '0 0 10px rgba(245, 158, 11, 0.5)' }}>04 ACTIVE</span>
                  </div>
                  <div style={{ display: 'flex' }} className="typing-line">
                    <span style={{ width: '120px', color: '#64748b' }}>[PROTOCOLS]</span>
                    <span style={{ color: '#06b6d4', textShadow: '0 0 10px rgba(6, 182, 212, 0.5)' }}>UNISWAP V4 + AAVE V3 + CHAINLINK</span>
                  </div>
                  <div style={{ display: 'flex' }} className="typing-line">
                    <span style={{ width: '120px', color: '#64748b' }}>[NETWORKS]</span>
                    <span style={{ color: '#e2e8f0' }}>POLYGON + BASE + ARBITRUM</span>
                  </div>
                  <div style={{ display: 'flex' }} className="typing-line">
                    <span style={{ width: '120px', color: '#64748b' }}>[ERC]</span>
                    <span style={{ color: '#a78bfa', textShadow: '0 0 10px rgba(167, 139, 250, 0.5)' }}>7702 + 1967 + 721 + 20</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons with glow effects */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <Link
                href="/hook-builder"
                className="glow-button"
                style={{ 
                  padding: '14px 28px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#0a0a0a',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  fontFamily: monoFont,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  borderRadius: '3px',
                  boxShadow: '0 0 20px rgba(245, 158, 11, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(245, 158, 11, 0.6), 0 8px 25px rgba(0, 0, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(245, 158, 11, 0.4), 0 4px 15px rgba(0, 0, 0, 0.3)';
                }}
              >
                ▶ LAUNCH HOOK BUILDER
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                className="outline-button"
                style={{ 
                  padding: '14px 28px',
                  background: 'rgba(0, 255, 157, 0.05)',
                  border: '1px solid #00ff9d',
                  borderRadius: '3px',
                  color: '#00ff9d',
                  fontSize: '13px',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  fontFamily: monoFont,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 0 15px rgba(0, 255, 157, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 157, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 157, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 157, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 157, 0.2)';
                }}
              >
                ◈ VIEW SOURCE
              </a>
            </div>
          </div>

          {/* Scroll indicator - animated */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}>
            <span style={{ 
              color: '#64748b', 
              fontSize: '11px', 
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              animation: 'bounce 2s infinite',
            }}>
              ▼ SCROLL TO EXPLORE
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          MODULES SECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section 
        id="modules-section"
        data-animate
        style={{ 
          position: 'relative',
          borderTop: '1px solid #1a1a2e',
          padding: '96px 32px',
          fontFamily: monoFont,
          zIndex: 1,
          opacity: visibleSections.has('modules-section') ? 1 : 0,
          transform: visibleSections.has('modules-section') ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          
          {/* Section header */}
          <div style={{ marginBottom: '48px' }}>
            <span style={{ 
              color: '#00ff9d', 
              fontSize: '14px', 
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}>
              · AVAILABLE MODULES
            </span>
            <h2 style={{ 
              color: '#e2e8f0', 
              fontSize: 'clamp(32px, 5vw, 48px)', 
              fontWeight: 'bold',
              margin: '8px 0 0 0',
            }}>
              FOUR POWERFUL TOOLS
            </h2>
          </div>

          {/* Modules grid - Glassmorphism cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '20px',
          }}>
            {modules.map((module, index) => (
              <Link
                key={module.id}
                href={module.href}
                className="module-card"
                style={{ 
                  position: 'relative',
                  background: 'rgba(15, 15, 25, 0.6)',
                  backdropFilter: 'blur(20px)',
                  padding: '36px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  textDecoration: 'none',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden',
                  opacity: visibleSections.has('modules-section') ? 1 : 0,
                  transform: visibleSections.has('modules-section') ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${index * 0.15}s`,
                }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(-8px) scale(1.02)';
                  card.style.boxShadow = `0 25px 50px rgba(0,0,0,0.5), 0 0 80px ${module.color}20, inset 0 1px 0 rgba(255,255,255,0.1)`;
                  card.style.borderColor = `${module.color}50`;
                  card.style.background = 'rgba(20, 20, 35, 0.8)';
                  const glow = card.querySelector('.card-glow') as HTMLElement;
                  if (glow) glow.style.opacity = '1';
                  const borderGlow = card.querySelector('.animated-border') as HTMLElement;
                  if (borderGlow) borderGlow.style.opacity = '1';
                  const icon = card.querySelector('.card-icon') as HTMLElement;
                  if (icon) icon.style.transform = 'scale(1.2) rotate(5deg)';
                  const arrow = card.querySelector('.card-arrow') as HTMLElement;
                  if (arrow) arrow.style.transform = 'translateX(10px)';
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'translateY(0) scale(1)';
                  card.style.boxShadow = 'none';
                  card.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  card.style.background = 'rgba(15, 15, 25, 0.6)';
                  const glow = card.querySelector('.card-glow') as HTMLElement;
                  if (glow) glow.style.opacity = '0';
                  const borderGlow = card.querySelector('.animated-border') as HTMLElement;
                  if (borderGlow) borderGlow.style.opacity = '0';
                  const icon = card.querySelector('.card-icon') as HTMLElement;
                  if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
                  const arrow = card.querySelector('.card-arrow') as HTMLElement;
                  if (arrow) arrow.style.transform = 'translateX(0)';
                }}
              >
                {/* Animated border gradient */}
                <div 
                  className="animated-border"
                  style={{
                    position: 'absolute',
                    inset: -1,
                    borderRadius: '5px',
                    background: `linear-gradient(135deg, ${module.color}60, transparent 40%, transparent 60%, ${module.color}60)`,
                    backgroundSize: '300% 300%',
                    animation: 'gradientShift 3s ease infinite',
                    opacity: 0,
                    transition: 'opacity 0.5s ease',
                    zIndex: -1,
                  }}
                />
                
                {/* Inner glow */}
                <div 
                  className="card-glow"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '4px',
                    background: `radial-gradient(circle at 30% 20%, ${module.color}15 0%, transparent 50%)`,
                    opacity: 0,
                    transition: 'opacity 0.5s ease',
                    pointerEvents: 'none',
                  }}
                />
                
                {/* Shine effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
                  transform: 'skewX(-15deg)',
                  animation: 'shine 4s ease-in-out infinite',
                  animationDelay: `${index * 0.5}s`,
                  pointerEvents: 'none',
                }} />
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span 
                      className="card-icon"
                      style={{ 
                        fontSize: '36px',
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        filter: `drop-shadow(0 0 15px ${module.color}50)`,
                      }}
                    >{module.icon}</span>
                    <span style={{ 
                      padding: '6px 14px',
                      background: `${module.color}15`,
                      border: `1px solid ${module.color}40`,
                      borderRadius: '3px',
                      color: module.color,
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em',
                      boxShadow: `0 0 15px ${module.color}20`,
                    }}>
                      {module.tag}
                    </span>
                  </div>
                  <h3 style={{ 
                    color: module.color, 
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    margin: '24px 0 14px 0',
                    textShadow: `0 0 30px ${module.color}40`,
                  }}>
                    {module.title}
                  </h3>
                  <p style={{ 
                    color: '#a1a1aa', 
                    fontSize: '14px', 
                    lineHeight: 1.8,
                    margin: 0,
                  }}>
                    {module.description}
                  </p>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '32px',
                    color: module.color,
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                  }}>
                    <span>OPEN MODULE</span>
                    <span 
                      className="card-arrow"
                      style={{ 
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        fontSize: '18px',
                      }}
                    >→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          PIPELINE SECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section 
        id="pipeline-section"
        data-animate
        style={{ 
          position: 'relative',
          borderTop: '1px solid #1a1a2e',
          padding: '96px 32px',
          fontFamily: monoFont,
          zIndex: 1,
          opacity: visibleSections.has('pipeline-section') ? 1 : 0,
          transform: visibleSections.has('pipeline-section') ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          
          <span style={{ 
            color: '#00ff9d', 
            fontSize: '14px', 
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}>
            · DEVELOPMENT PIPELINE
          </span>
          <h2 style={{ 
            color: '#e2e8f0', 
            fontSize: 'clamp(24px, 4vw, 32px)', 
            fontWeight: 'bold',
            margin: '8px 0 40px 0',
          }}>
            COMPOSE → DEPLOY IN 25 MINUTES
          </h2>

          {/* Pipeline */}
          <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: '16px', paddingTop: '10px' }}>
            {pipelineSteps.map((step, i) => (
              <div 
                key={step.label} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  opacity: visibleSections.has('pipeline-section') ? 1 : 0,
                  transform: visibleSections.has('pipeline-section') ? 'translateX(0)' : 'translateX(20px)',
                  transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${i * 0.15}s`,
                }}
              >
                <div 
                  className="pipeline-step"
                  style={{ 
                    background: '#111118',
                    border: i === 4 ? '1px solid #f59e0b' : '1px solid #1a1a2e',
                    padding: '20px 28px',
                    textAlign: 'center',
                    minWidth: '130px',
                    transition: 'all 0.3s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#7c3aed';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(124,58,237,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = i === 4 ? '#f59e0b' : '#1a1a2e';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <span style={{ fontSize: '28px', display: 'block', marginBottom: '10px' }}>{step.icon}</span>
                  <span style={{ 
                    color: i === 4 ? '#f59e0b' : '#94a3b8', 
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 'bold',
                  }}>
                    {step.label}
                  </span>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <span 
                    style={{ 
                      color: '#f59e0b', 
                      fontSize: '18px', 
                      margin: '0 20px',
                      animation: 'arrowPulse 1.5s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                    }}
                  >▶</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          TECH STACK SECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section 
        id="tech-section"
        data-animate
        style={{ 
          position: 'relative',
          borderTop: '1px solid #1a1a2e',
          padding: '64px 32px',
          fontFamily: monoFont,
          zIndex: 1,
          opacity: visibleSections.has('tech-section') ? 1 : 0,
          transform: visibleSections.has('tech-section') ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          
          <span style={{ 
            color: '#00ff9d', 
            fontSize: '14px', 
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}>
            · TECH STACK
          </span>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '24px' }}>
            {techStack.map((tech, index) => (
              <span
                key={tech.name}
                style={{ 
                  background: '#111118',
                  border: '1px solid #1a1a2e',
                  padding: '10px 18px',
                  color: tech.color,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  cursor: 'default',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  fontWeight: 'bold',
                  opacity: visibleSections.has('tech-section') ? 1 : 0,
                  transform: visibleSections.has('tech-section') ? 'translateY(0)' : 'translateY(10px)',
                  transitionDelay: `${index * 0.05}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = tech.color;
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${tech.color}20`;
                  e.currentTarget.style.background = `${tech.color}10`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1a1a2e';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#111118';
                }}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════════════════════════════════ */}
      <section 
        id="cta-section"
        data-animate
        style={{ 
          position: 'relative',
          borderTop: '1px solid #1a1a2e',
          borderBottom: '1px solid #1a1a2e',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(6,182,212,0.08) 100%)',
          padding: '96px 32px',
          textAlign: 'center',
          fontFamily: monoFont,
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Animated background shimmer */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%)',
          animation: 'shimmer 3s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        
        <div 
          style={{ 
            maxWidth: '1152px', 
            margin: '0 auto',
            position: 'relative',
            opacity: visibleSections.has('cta-section') ? 1 : 0,
            transform: visibleSections.has('cta-section') ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          
          <span style={{ 
            color: '#00ff9d', 
            fontSize: '14px', 
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}>
            · READY TO DEPLOY
          </span>
          <h2 style={{ 
            color: '#e2e8f0', 
            fontSize: 'clamp(32px, 5vw, 48px)', 
            fontWeight: 'bold',
            margin: '8px 0 16px 0',
          }}>
            START BUILDING NOW
          </h2>
          <div style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6 }}>
            <p style={{ margin: 0 }}>// Compose your first Uniswap V4 Hook in under 25 minutes.</p>
            <p style={{ margin: 0 }}>// No setup required. Connect wallet and start building.</p>
          </div>
          <Link
            href="/hook-builder"
            className="cta-button"
            style={{ 
              display: 'inline-block',
              marginTop: '32px',
              padding: '18px 48px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#0a0a0a',
              fontSize: '14px',
              fontWeight: 'bold',
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontFamily: monoFont,
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 4px 20px rgba(245,158,11,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(245,158,11,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(245,158,11,0.3)';
            }}
          >
            ▶ OPEN HOOK BUILDER
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════════════ */}
      <footer style={{ 
        position: 'relative',
        borderTop: '1px solid #1a1a2e',
        padding: '24px 32px',
        fontFamily: monoFont,
        zIndex: 1,
      }}>
        <div style={{ 
          maxWidth: '1152px', 
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          
          {/* Left */}
          <div>
            <span style={{ color: '#e2e8f0', fontSize: '11px', display: 'block' }}>FORGEKIT V1.0.0</span>
            <span style={{ color: '#64748b', fontSize: '11px', marginTop: '2px', display: 'block' }}>
              UNIVERSAL WEB3 DEVELOPER PLATFORM
            </span>
          </div>

          {/* Center */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <a 
              href="https://github.com" 
              target="_blank"
              style={{ 
                color: '#64748b', 
                fontSize: '11px',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
            >
              GITHUB
            </a>
            <span style={{ color: '#64748b', fontSize: '11px' }}>·</span>
            <a 
              href="#"
              style={{ 
                color: '#64748b', 
                fontSize: '11px',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
            >
              DOCS
            </a>
          </div>

          {/* Right */}
          <span style={{ color: '#64748b', fontSize: '11px' }}>
            BUILT BY <span style={{ color: '#e2e8f0' }}>ABHINAV MALIK</span> · KIET
          </span>
        </div>
      </footer>

      {/* Global styles for animations */}
      <style jsx global>{`
        /* Base animations */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .cursor-blink {
          animation: blink 1s infinite;
        }
        
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        
        /* Background animations */
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes auroraMove {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(2%, 1%) rotate(1deg); }
          50% { transform: translate(-1%, 2%) rotate(-1deg); }
          75% { transform: translate(-2%, -1%) rotate(0.5deg); }
        }
        
        @keyframes floatShape {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.6; }
        }
        
        @keyframes gridScroll {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(60px); }
        }
        
        @keyframes scanline {
          0% { top: -2px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        /* Card animations */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 100%; }
          100% { left: 100%; }
        }
        
        @keyframes borderGlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Scroll indicator */
        @keyframes scrollIndicator {
          0%, 100% { 
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          50% { 
            transform: translateX(-50%) translateY(10px);
            opacity: 0.3;
          }
        }
        
        /* Pipeline animations */
        @keyframes arrowPulse {
          0%, 100% { opacity: 0.6; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(4px); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .hidden { display: none !important; }
        }
        
        @media (max-width: 900px) {
          .module-card {
            grid-column: span 2 !important;
          }
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #050508;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #7c3aed 0%, #06b6d4 100%);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #9333ea 0%, #0891b2 100%);
        }
        
        /* Selection color */
        ::selection {
          background: rgba(124, 58, 237, 0.3);
          color: #fff;
        }
        
        /* Typing animation for terminal lines */
        .typing-line {
          animation: fadeInUp 0.5s ease forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .typing-line:nth-child(1) { animation-delay: 0.1s; }
        .typing-line:nth-child(2) { animation-delay: 0.2s; }
        .typing-line:nth-child(3) { animation-delay: 0.3s; }
        .typing-line:nth-child(4) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}
