import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1a1a2e] rounded-full mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h1 className="font-mono text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="font-mono text-xl text-[#888] mb-6 uppercase tracking-wider">
          Page Not Found
        </h2>
        <p className="font-mono text-sm text-[#666] mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff9d] text-black font-mono font-semibold text-sm uppercase tracking-wider hover:bg-[#00cc7d] transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
