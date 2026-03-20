// Deployment related types

export type DeploymentStatus = "idle" | "deploying" | "confirmed" | "error";

export type MiningStatus = "idle" | "mining" | "found";

export type PermissionStatus = "idle" | "computing" | "set";

export interface Chain {
  id: string;
  name: string;
  chainId?: number;
  rpcUrl?: string;
  blockExplorer?: string;
}

export interface DeploymentResult {
  txHash: string;
  contractAddress: string;
  blockNumber: number;
  gasUsed: bigint;
}

export interface MiningResult {
  address: string;
  salt: string;
  attempts: number;
  timeMs: number;
}

export interface DeploymentState {
  status: DeploymentStatus;
  step: string;
  txHash: string | null;
  deployedAddress: string | null;
  blockNumber: string | null;
  errorMessage: string | null;
}
