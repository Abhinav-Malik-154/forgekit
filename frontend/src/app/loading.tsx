export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#00ff9d] border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-sm text-[#888] uppercase tracking-wider">
          Loading...
        </p>
      </div>
    </div>
  );
}
