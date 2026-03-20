import type { LifecycleBlock, ModuleBlock } from "@/types";

export const LIFECYCLE_BLOCKS: LifecycleBlock[] = [
  { id: "beforeSwap", name: "BEFORE_SWAP", color: "#f59e0b", bit: 7 },
  { id: "afterSwap", name: "AFTER_SWAP", color: "#f59e0b", bit: 6 },
  { id: "beforeAddLiquidity", name: "BEFORE_ADD_LIQ", color: "#06b6d4", bit: 5 },
  { id: "afterAddLiquidity", name: "AFTER_ADD_LIQ", color: "#06b6d4", bit: 4 },
  { id: "beforeRemoveLiquidity", name: "BEFORE_REMOVE_LIQ", color: "#a78bfa", bit: 3 },
  { id: "afterRemoveLiquidity", name: "AFTER_REMOVE_LIQ", color: "#a78bfa", bit: 2 },
];

export const MODULE_BLOCKS: ModuleBlock[] = [
  { id: "dynamicFee", name: "DYNAMIC FEE", color: "#00ff9d", hooks: ["beforeSwap"] },
  { id: "twamm", name: "TWAMM", color: "#00ff9d", hooks: ["beforeSwap", "afterSwap"] },
  { id: "mevRebate", name: "MEV REBATE", color: "#00ff9d", hooks: ["afterSwap"] },
  { id: "limitOrder", name: "LIMIT ORDER", color: "#00ff9d", hooks: ["afterSwap"] },
  { id: "whitelistGate", name: "WHITELIST GATE", color: "#00ff9d", hooks: ["beforeAddLiquidity", "beforeSwap"] },
];

export const DEFAULT_HOOK_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";

// Drag lifecycle blocks from the left panel
// to add hook callbacks to your contract

contract MyHook is BaseHook {

    constructor(IPoolManager _poolManager)
        BaseHook(_poolManager) {}

    function getHookPermissions()
        public
        pure
        override
        returns (Hooks.Permissions memory)
    {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: false,
            afterSwap: false,
            beforeDonate: false,
            afterDonate: false,
            beforeSwapReturnDelta: false,
            afterSwapReturnDelta: false,
            afterAddLiquidityReturnDelta: false,
            afterRemoveReturnDelta: false
        });
    }
}`;

// Pre-compiled minimal deployable contract bytecode
export const HOOK_BYTECODE = "0x6080604052348015600e575f5ffd5b50606580601a5f395ff3fe6080604052348015600e575f5ffd5b50600436106026575f3560e01c806360fe47b114602a575b5f5ffd5b60406035366004604e565b5f819055919050565b60405190815260200160405180910390f35b5f60208284031215605d575f5ffd5b503591905056fea164736f6c634300081b000a" as `0x${string}`;

// ForgeKit registry contract address
export const REGISTRY_ADDRESS = "0x0000000000000000000000000000000000000000";
