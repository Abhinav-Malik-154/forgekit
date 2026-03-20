"use client";

import { cn } from "@/lib/utils";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import type { DeploymentStatus } from "@/types";
import { Button } from "@/components/ui";

interface DeployPanelProps {
  selectedChain: string;
  onChainChange: (chainId: string) => void;
  status: DeploymentStatus;
  step: string;
  txHash: string | null;
  deployedAddress: string | null;
  blockNumber: string | null;
  errorMessage: string | null;
  isConnected: boolean;
  onDeploy: () => void;
  onCopyTx: () => void;
  copyTxText: string;
}

export function DeployPanel({
  selectedChain,
  onChainChange,
  status,
  step,
  txHash,
  deployedAddress,
  blockNumber,
  errorMessage,
  isConnected,
  onDeploy,
  onCopyTx,
  copyTxText,
}: DeployPanelProps) {
  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
  };

  return (
    <div className="p-4 bg-[#0a0a0f] border border-[#1a1a2e] rounded-lg">
      <h4 className="font-mono text-xs font-semibold text-[#888] uppercase tracking-wider mb-4">
        Deploy Contract
      </h4>

      {/* Chain Selector */}
      <div className="mb-4">
        <label className="block font-mono text-xs text-[#666] mb-2 uppercase tracking-wider">
          Target Chain
        </label>
        <select
          value={selectedChain}
          onChange={(e) => onChainChange(e.target.value)}
          className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#333] rounded-md font-mono text-sm text-white focus:outline-none focus:border-[#00ff9d]"
        >
          {SUPPORTED_CHAINS.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </select>
      </div>

      {/* Deploy Button */}
      <Button
        onClick={onDeploy}
        disabled={!isConnected || status === "deploying"}
        isLoading={status === "deploying"}
        variant="primary"
        className="w-full mb-4"
      >
        {!isConnected
          ? "Connect Wallet"
          : status === "deploying"
          ? "Deploying..."
          : "Deploy Hook"}
      </Button>

      {/* Status */}
      {step && (
        <div className="mb-4 p-3 bg-[#1a1a2e]/50 border border-[#333] rounded-md">
          <span className="font-mono text-xs text-[#888]">{step}</span>
        </div>
      )}

      {/* Success */}
      {status === "confirmed" && txHash && (
        <div className="p-4 bg-[#00ff9d]/10 border border-[#00ff9d]/30 rounded-md">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#00ff9d]">✓</span>
            <span className="font-mono text-sm text-[#00ff9d] font-semibold">
              Deployment Successful
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#666]">TX Hash:</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-xs text-white">
                  {truncateHash(txHash)}
                </code>
                <button
                  onClick={onCopyTx}
                  className="font-mono text-[10px] text-[#00ff9d] hover:underline"
                >
                  {copyTxText}
                </button>
              </div>
            </div>

            {deployedAddress && (
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#666]">Address:</span>
                <code className="font-mono text-xs text-white">
                  {truncateHash(deployedAddress)}
                </code>
              </div>
            )}

            {blockNumber && (
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#666]">Block:</span>
                <code className="font-mono text-xs text-white">
                  #{blockNumber}
                </code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-400">✕</span>
            <span className="font-mono text-sm text-red-400 font-semibold">
              Deployment Failed
            </span>
          </div>
          <p className="font-mono text-xs text-red-300">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
