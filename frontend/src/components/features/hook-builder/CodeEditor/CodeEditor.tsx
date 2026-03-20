"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#00ff9d] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs text-[#888]">Loading editor...</span>
      </div>
    </div>
  ),
});

interface CodeEditorProps {
  code: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  height?: string;
  className?: string;
}

export function CodeEditor({
  code,
  onChange,
  readOnly = false,
  height = "100%",
  className,
}: CodeEditorProps) {
  return (
    <div className={cn("relative", className)}>
      <MonacoEditor
        height={height}
        language="sol"
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          renderLineHighlight: "line",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
        }}
      />
    </div>
  );
}
