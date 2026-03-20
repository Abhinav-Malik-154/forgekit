import type { Chain } from "@/types";

export const SUPPORTED_CHAINS: Chain[] = [
  {
    id: "polygon-amoy",
    name: "POLYGON AMOY",
    chainId: 80002,
    blockExplorer: "https://amoy.polygonscan.com",
  },
  {
    id: "base-sepolia",
    name: "BASE SEPOLIA",
    chainId: 84532,
    blockExplorer: "https://sepolia.basescan.org",
  },
  {
    id: "arbitrum-sepolia",
    name: "ARBITRUM SEPOLIA",
    chainId: 421614,
    blockExplorer: "https://sepolia.arbiscan.io",
  },
  {
    id: "ethereum-sepolia",
    name: "ETHEREUM SEPOLIA",
    chainId: 11155111,
    blockExplorer: "https://sepolia.etherscan.io",
  },
];

export const DEFAULT_CHAIN = SUPPORTED_CHAINS[0];

export function getChainById(id: string): Chain | undefined {
  return SUPPORTED_CHAINS.find((chain) => chain.id === id);
}

export function getBlockExplorerUrl(chainId: string, txHash: string): string {
  const chain = getChainById(chainId);
  if (!chain?.blockExplorer) return "";
  return `${chain.blockExplorer}/tx/${txHash}`;
}

export function getBlockExplorerAddressUrl(chainId: string, address: string): string {
  const chain = getChainById(chainId);
  if (!chain?.blockExplorer) return "";
  return `${chain.blockExplorer}/address/${address}`;
}
