import type { HookPermissions } from "@/types";

/**
 * Generates permission bits string from selected blocks
 */
export function generatePermissionBits(blocks: string[]): string {
  const bitPositions: Record<string, number> = {
    beforeSwap: 7,
    afterSwap: 6,
    beforeAddLiquidity: 5,
    afterAddLiquidity: 4,
    beforeRemoveLiquidity: 3,
    afterRemoveLiquidity: 2,
  };

  let bits = "00000000000000";
  const bitArray = bits.split("");

  blocks.forEach((blockId) => {
    const bit = bitPositions[blockId];
    if (bit !== undefined) {
      bitArray[13 - bit] = "1";
    }
  });

  return bitArray.join("");
}

/**
 * Creates permission object from selected blocks
 */
export function createPermissions(blocks: string[]): HookPermissions {
  return {
    beforeInitialize: false,
    afterInitialize: false,
    beforeAddLiquidity: blocks.includes("beforeAddLiquidity"),
    afterAddLiquidity: blocks.includes("afterAddLiquidity"),
    beforeRemoveLiquidity: blocks.includes("beforeRemoveLiquidity"),
    afterRemoveLiquidity: blocks.includes("afterRemoveLiquidity"),
    beforeSwap: blocks.includes("beforeSwap"),
    afterSwap: blocks.includes("afterSwap"),
    beforeDonate: false,
    afterDonate: false,
    beforeSwapReturnDelta: false,
    afterSwapReturnDelta: false,
    afterAddLiquidityReturnDelta: false,
    afterRemoveReturnDelta: false,
  };
}

/**
 * Generates callback function code for a given block
 */
function generateCallbackFunction(
  block: string,
  modules: string[]
): string {
  const hasDynamicFee = modules.includes("dynamicFee");
  const hasLimitOrder = modules.includes("limitOrder");
  const hasTwamm = modules.includes("twamm");
  const hasMevRebate = modules.includes("mevRebate");
  const hasWhitelistGate = modules.includes("whitelistGate");

  switch (block) {
    case "beforeSwap": {
      let body = "// TODO: Add your beforeSwap logic here";
      if (hasDynamicFee) {
        body = `// Dynamic fee: calculates fee based on volatility
        uint24 dynamicFee = _calculateDynamicFee(key, params);`;
      } else if (hasTwamm) {
        body = "// TWAMM: Execute virtual orders before swap";
      } else if (hasWhitelistGate) {
        body =
          '// Whitelist Gate: Check if sender is whitelisted\n        require(_isWhitelisted(sender), "Not whitelisted");';
      }
      return `
    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    ) external override returns (bytes4, BeforeSwapDelta, uint24) {
        ${body}
        return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    }`;
    }

    case "afterSwap": {
      let body = "// TODO: Add your afterSwap logic here";
      if (hasLimitOrder) {
        body = "// Limit Order: Check and execute pending limit orders";
      } else if (hasTwamm) {
        body = "// TWAMM: Update virtual order state after swap";
      } else if (hasMevRebate) {
        body = "// MEV Rebate: Calculate and distribute MEV rebate to user";
      }
      return `
    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        int128 delta,
        bytes calldata hookData
    ) external override returns (bytes4, int128) {
        ${body}
        return (BaseHook.afterSwap.selector, 0);
    }`;
    }

    case "beforeAddLiquidity": {
      let body = "// TODO: Add your beforeAddLiquidity logic here";
      if (hasWhitelistGate) {
        body =
          '// Whitelist Gate: Check if sender is whitelisted\n        require(_isWhitelisted(sender), "Not whitelisted");';
      }
      return `
    function beforeAddLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        bytes calldata hookData
    ) external override returns (bytes4) {
        ${body}
        return BaseHook.beforeAddLiquidity.selector;
    }`;
    }

    case "afterAddLiquidity":
      return `
    function afterAddLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        BalanceDelta delta,
        BalanceDelta feesAccrued,
        bytes calldata hookData
    ) external override returns (bytes4, BalanceDelta) {
        // TODO: Add your afterAddLiquidity logic here
        return (BaseHook.afterAddLiquidity.selector, delta);
    }`;

    case "beforeRemoveLiquidity":
      return `
    function beforeRemoveLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        bytes calldata hookData
    ) external override returns (bytes4) {
        // TODO: Add your beforeRemoveLiquidity logic here
        return BaseHook.beforeRemoveLiquidity.selector;
    }`;

    case "afterRemoveLiquidity":
      return `
    function afterRemoveLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        BalanceDelta delta,
        BalanceDelta feesAccrued,
        bytes calldata hookData
    ) external override returns (bytes4, BalanceDelta) {
        // TODO: Add your afterRemoveLiquidity logic here
        return (BaseHook.afterRemoveLiquidity.selector, delta);
    }`;

    default:
      return "";
  }
}

/**
 * Generates helper functions based on active modules
 */
function generateHelperFunctions(modules: string[]): string {
  let helpers = "";

  if (modules.includes("dynamicFee")) {
    helpers += `

    function _calculateDynamicFee(
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params
    ) internal view returns (uint24) {
        // TODO: Implement dynamic fee calculation based on volatility
        // Example: Higher volatility = higher fee
        return 3000; // Default 0.3% fee
    }`;
  }

  if (modules.includes("whitelistGate")) {
    helpers += `

    mapping(address => bool) private _whitelist;

    function _isWhitelisted(address account) internal view returns (bool) {
        return _whitelist[account];
    }

    function addToWhitelist(address account) external {
        // TODO: Add access control
        _whitelist[account] = true;
    }`;
  }

  return helpers;
}

/**
 * Generates complete Solidity code for a hook
 */
export function generateSolidityCode(
  blocks: string[],
  modules: string[]
): string {
  if (blocks.length === 0) {
    return `// SPDX-License-Identifier: MIT
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
  }

  const permissions = createPermissions(blocks);
  const callbackFunctions = blocks
    .map((block) => generateCallbackFunction(block, modules))
    .filter(Boolean)
    .join("\n");
  const helperFunctions = generateHelperFunctions(modules);

  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BaseHook} from "v4-periphery/src/base/hooks/BaseHook.sol";
import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/src/types/BeforeSwapDelta.sol";

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
            beforeInitialize: ${permissions.beforeInitialize},
            afterInitialize: ${permissions.afterInitialize},
            beforeAddLiquidity: ${permissions.beforeAddLiquidity},
            afterAddLiquidity: ${permissions.afterAddLiquidity},
            beforeRemoveLiquidity: ${permissions.beforeRemoveLiquidity},
            afterRemoveLiquidity: ${permissions.afterRemoveLiquidity},
            beforeSwap: ${permissions.beforeSwap},
            afterSwap: ${permissions.afterSwap},
            beforeDonate: ${permissions.beforeDonate},
            afterDonate: ${permissions.afterDonate},
            beforeSwapReturnDelta: ${permissions.beforeSwapReturnDelta},
            afterSwapReturnDelta: ${permissions.afterSwapReturnDelta},
            afterAddLiquidityReturnDelta: ${permissions.afterAddLiquidityReturnDelta},
            afterRemoveReturnDelta: ${permissions.afterRemoveReturnDelta}
        });
    }${callbackFunctions}${helperFunctions}
}`;
}
