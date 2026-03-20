"use client";

import { cn } from "@/lib/utils";
import { LIFECYCLE_BLOCKS, MODULE_BLOCKS } from "@/lib/constants";

interface BlockPaletteProps {
  selectedBlocks: string[];
  activeModules: string[];
  onToggleBlock: (blockId: string) => void;
  onToggleModule: (moduleId: string) => void;
}

export function BlockPalette({
  selectedBlocks,
  activeModules,
  onToggleBlock,
  onToggleModule,
}: BlockPaletteProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Lifecycle Blocks */}
      <div>
        <h3 className="font-mono text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">
          Lifecycle Hooks
        </h3>
        <div className="flex flex-col gap-2">
          {LIFECYCLE_BLOCKS.map((block) => {
            const isSelected = selectedBlocks.includes(block.id);
            return (
              <button
                key={block.id}
                onClick={() => onToggleBlock(block.id)}
                className={cn(
                  "w-full px-3 py-2 rounded-md font-mono text-xs font-semibold uppercase tracking-wider",
                  "border transition-all duration-200",
                  "text-left",
                  isSelected
                    ? "border-current bg-current/10"
                    : "border-[#333] bg-[#0a0a0f] hover:border-[#555]"
                )}
                style={{
                  color: isSelected ? block.color : "#888",
                  borderColor: isSelected ? block.color : undefined,
                  backgroundColor: isSelected
                    ? `${block.color}15`
                    : undefined,
                }}
              >
                <span className="mr-2">{isSelected ? "●" : "○"}</span>
                {block.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Blocks */}
      <div>
        <h3 className="font-mono text-xs font-semibold text-[#888] uppercase tracking-wider mb-3">
          Modules
        </h3>
        <div className="flex flex-col gap-2">
          {MODULE_BLOCKS.map((module) => {
            const isActive = activeModules.includes(module.id);
            return (
              <button
                key={module.id}
                onClick={() => onToggleModule(module.id)}
                className={cn(
                  "w-full px-3 py-2 rounded-md font-mono text-xs font-semibold uppercase tracking-wider",
                  "border transition-all duration-200",
                  "text-left",
                  isActive
                    ? "border-[#00ff9d] bg-[#00ff9d]/10 text-[#00ff9d]"
                    : "border-[#333] bg-[#0a0a0f] text-[#888] hover:border-[#555]"
                )}
              >
                <span className="mr-2">{isActive ? "◆" : "◇"}</span>
                {module.name}
                <span className="ml-auto text-[10px] opacity-60">
                  ({module.hooks.length} hooks)
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Permission Summary */}
      <div className="p-3 bg-[#0a0a0f] border border-[#1a1a2e] rounded-md">
        <h4 className="font-mono text-xs font-semibold text-[#888] uppercase tracking-wider mb-2">
          Active Permissions
        </h4>
        <div className="flex flex-wrap gap-1">
          {selectedBlocks.length === 0 ? (
            <span className="font-mono text-xs text-[#555]">None selected</span>
          ) : (
            selectedBlocks.map((blockId) => {
              const block = LIFECYCLE_BLOCKS.find((b) => b.id === blockId);
              return (
                <span
                  key={blockId}
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold"
                  style={{
                    backgroundColor: `${block?.color}20`,
                    color: block?.color,
                  }}
                >
                  {block?.name}
                </span>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
