"use client";

import { useState, useCallback } from "react";
import { useWalletClient, usePublicClient, useAccount } from "wagmi";
import type { DeploymentStatus } from "@/types";
import { HOOK_BYTECODE } from "@/lib/constants";

interface DeploymentState {
  status: DeploymentStatus;
  step: string;
  txHash: string | null;
  deployedAddress: string | null;
  blockNumber: string | null;
  errorMessage: string | null;
}

interface UseDeploymentReturn extends DeploymentState {
  deploy: () => Promise<void>;
  reset: () => void;
}

const initialState: DeploymentState = {
  status: "idle",
  step: "",
  txHash: null,
  deployedAddress: null,
  blockNumber: null,
  errorMessage: null,
};

/**
 * Hook for deploying contracts
 */
export function useDeployment(): UseDeploymentReturn {
  const [state, setState] = useState<DeploymentState>(initialState);

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { isConnected } = useAccount();

  const deploy = useCallback(async () => {
    if (!walletClient || !publicClient || !isConnected) {
      setState((prev) => ({
        ...prev,
        status: "error",
        errorMessage: "Wallet not connected",
      }));
      return;
    }

    try {
      setState({
        status: "deploying",
        step: "Preparing transaction...",
        txHash: null,
        deployedAddress: null,
        blockNumber: null,
        errorMessage: null,
      });

      // Get account address
      const [account] = await walletClient.getAddresses();

      setState((prev) => ({
        ...prev,
        step: "Requesting signature...",
      }));

      // Send deployment transaction
      const hash = await walletClient.deployContract({
        abi: [],
        bytecode: HOOK_BYTECODE,
        account,
      });

      setState((prev) => ({
        ...prev,
        step: "Waiting for confirmation...",
        txHash: hash,
      }));

      // Wait for receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      setState({
        status: "confirmed",
        step: "Deployment confirmed!",
        txHash: hash,
        deployedAddress: receipt.contractAddress || null,
        blockNumber: receipt.blockNumber.toString(),
        errorMessage: null,
      });
    } catch (error) {
      setState({
        status: "error",
        step: "",
        txHash: null,
        deployedAddress: null,
        blockNumber: null,
        errorMessage: error instanceof Error ? error.message : "Deployment failed",
      });
    }
  }, [walletClient, publicClient, isConnected]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    deploy,
    reset,
  };
}
