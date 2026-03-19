'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useWalletClient, usePublicClient, useAccount } from 'wagmi';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const monoFont = "'JetBrains Mono', 'Fira Code', monospace";

// Pre-compiled minimal deployable contract bytecode
// Simple storage contract for demonstration
const HOOK_BYTECODE = '0x6080604052348015600e575f5ffd5b50606580601a5f395ff3fe6080604052348015600e575f5ffd5b50600436106026575f3560e01c806360fe47b114602a575b5f5ffd5b60406035366004604e565b5f819055919050565b60405190815260200160405180910390f35b5f60208284031215605d575f5ffd5b503591905056fea164736f6c634300081b000a' as `0x${string}`;

// ForgeKit registry contract address (placeholder)
const REGISTRY_ADDRESS = "0x0000000000000000000000000000000000000000";

const defaultCode = `// SPDX-License-Identifier: MIT
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

const lifecycleBlocks = [
  { id: 'beforeSwap', name: 'BEFORE_SWAP', color: '#f59e0b', bit: 7 },
  { id: 'afterSwap', name: 'AFTER_SWAP', color: '#f59e0b', bit: 6 },
  { id: 'beforeAddLiquidity', name: 'BEFORE_ADD_LIQ', color: '#06b6d4', bit: 5 },
  { id: 'afterAddLiquidity', name: 'AFTER_ADD_LIQ', color: '#06b6d4', bit: 4 },
  { id: 'beforeRemoveLiquidity', name: 'BEFORE_REMOVE_LIQ', color: '#a78bfa', bit: 3 },
  { id: 'afterRemoveLiquidity', name: 'AFTER_REMOVE_LIQ', color: '#a78bfa', bit: 2 },
];

const moduleBlocks = [
  { id: 'dynamicFee', name: 'DYNAMIC FEE', color: '#00ff9d', hooks: ['beforeSwap'] },
  { id: 'twamm', name: 'TWAMM', color: '#00ff9d', hooks: ['beforeSwap', 'afterSwap'] },
  { id: 'mevRebate', name: 'MEV REBATE', color: '#00ff9d', hooks: ['afterSwap'] },
  { id: 'limitOrder', name: 'LIMIT ORDER', color: '#00ff9d', hooks: ['afterSwap'] },
  { id: 'whitelistGate', name: 'WHITELIST GATE', color: '#00ff9d', hooks: ['beforeAddLiquidity', 'beforeSwap'] },
];

const chains = [
  { id: 'polygon-amoy', name: 'POLYGON AMOY' },
  { id: 'base-sepolia', name: 'BASE SEPOLIA' },
  { id: 'arbitrum-sepolia', name: 'ARBITRUM SEPOLIA' },
  { id: 'ethereum-sepolia', name: 'ETHEREUM SEPOLIA' },
];

type DeployStatusType = 'idle' | 'deploying' | 'confirmed' | 'error';

export default function HookBuilderPage() {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [generatedCode, setGeneratedCode] = useState(defaultCode);
  const [miningProgress, setMiningProgress] = useState(0);
  const [miningAttempts, setMiningAttempts] = useState(0);
  const [selectedChain, setSelectedChain] = useState('polygon-amoy');
  const [deployStatus, setDeployStatus] = useState<DeployStatusType>('idle');
  const [deployStep, setDeployStep] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<'idle' | 'computing' | 'set'>('idle');
  const [minedAddress, setMinedAddress] = useState<string | null>(null);
  const [miningStatus, setMiningStatus] = useState<'idle' | 'mining' | 'found'>('idle');
  const [miningTimeMs, setMiningTimeMs] = useState(0);
  const [copyText, setCopyText] = useState('COPY');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [blockNumber, setBlockNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copyTxText, setCopyTxText] = useState('COPY');
  const workerRef = useRef<Worker | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);

  // Wagmi hooks
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { isConnected } = useAccount();

  const generatePermissionBits = useCallback((blocks: string[]) => {
    let bits = '00000000000000';
    const bitArray = bits.split('');
    blocks.forEach(blockId => {
      const block = lifecycleBlocks.find(b => b.id === blockId);
      if (block) {
        bitArray[13 - block.bit] = '1';
      }
    });
    return bitArray.join('');
  }, []);

  const generateSolidityCode = useCallback((blocks: string[], modules: string[]) => {
    if (blocks.length === 0) {
      return defaultCode;
    }

    const permissions = {
      beforeInitialize: false,
      afterInitialize: false,
      beforeAddLiquidity: blocks.includes('beforeAddLiquidity'),
      afterAddLiquidity: blocks.includes('afterAddLiquidity'),
      beforeRemoveLiquidity: blocks.includes('beforeRemoveLiquidity'),
      afterRemoveLiquidity: blocks.includes('afterRemoveLiquidity'),
      beforeSwap: blocks.includes('beforeSwap'),
      afterSwap: blocks.includes('afterSwap'),
      beforeDonate: false,
      afterDonate: false,
      beforeSwapReturnDelta: false,
      afterSwapReturnDelta: false,
      afterAddLiquidityReturnDelta: false,
      afterRemoveReturnDelta: false,
    };

    const hasDynamicFee = modules.includes('dynamicFee');
    const hasLimitOrder = modules.includes('limitOrder');
    const hasTwamm = modules.includes('twamm');
    const hasMevRebate = modules.includes('mevRebate');
    const hasWhitelistGate = modules.includes('whitelistGate');

    const callbackFunctions = blocks.map(block => {
      switch(block) {
        case 'beforeSwap':
          let beforeSwapBody = '// TODO: Add your beforeSwap logic here';
          if (hasDynamicFee) {
            beforeSwapBody = `// Dynamic fee: calculates fee based on volatility
        uint24 dynamicFee = _calculateDynamicFee(key, params);`;
          } else if (hasTwamm) {
            beforeSwapBody = '// TWAMM: Execute virtual orders before swap';
          } else if (hasWhitelistGate) {
            beforeSwapBody = '// Whitelist Gate: Check if sender is whitelisted\n        require(_isWhitelisted(sender), "Not whitelisted");';
          }
          return `
    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    ) external override returns (bytes4, BeforeSwapDelta, uint24) {
        ${beforeSwapBody}
        return (BaseHook.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0);
    }`;
        case 'afterSwap':
          let afterSwapBody = '// TODO: Add your afterSwap logic here';
          if (hasLimitOrder) {
            afterSwapBody = '// Limit Order: Check and execute pending limit orders';
          } else if (hasTwamm) {
            afterSwapBody = '// TWAMM: Update virtual order state after swap';
          } else if (hasMevRebate) {
            afterSwapBody = '// MEV Rebate: Calculate and distribute MEV rebate to user';
          }
          return `
    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        int128 delta,
        bytes calldata hookData
    ) external override returns (bytes4, int128) {
        ${afterSwapBody}
        return (BaseHook.afterSwap.selector, 0);
    }`;
        case 'beforeAddLiquidity':
          let beforeAddLiqBody = '// TODO: Add your beforeAddLiquidity logic here';
          if (hasWhitelistGate) {
            beforeAddLiqBody = '// Whitelist Gate: Check if sender is whitelisted\n        require(_isWhitelisted(sender), "Not whitelisted");';
          }
          return `
    function beforeAddLiquidity(
        address sender,
        PoolKey calldata key,
        IPoolManager.ModifyLiquidityParams calldata params,
        bytes calldata hookData
    ) external override returns (bytes4) {
        ${beforeAddLiqBody}
        return BaseHook.beforeAddLiquidity.selector;
    }`;
        case 'afterAddLiquidity':
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
        case 'beforeRemoveLiquidity':
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
        case 'afterRemoveLiquidity':
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
          return '';
      }
    }).filter(Boolean).join('\n');

    // Add helper functions based on active modules
    let helperFunctions = '';
    if (hasDynamicFee) {
      helperFunctions += `

    function _calculateDynamicFee(
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params
    ) internal view returns (uint24) {
        // TODO: Implement dynamic fee calculation based on volatility
        // Example: Higher volatility = higher fee
        return 3000; // Default 0.3% fee
    }`;
    }
    if (hasWhitelistGate) {
      helperFunctions += `

    mapping(address => bool) private _whitelist;

    function _isWhitelisted(address account) internal view returns (bool) {
        return _whitelist[account];
    }

    function addToWhitelist(address account) external {
        // TODO: Add access control
        _whitelist[account] = true;
    }`;
    }

    const newCode = `// SPDX-License-Identifier: MIT
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

    return newCode;
  }, []);

  const toggleBlock = useCallback((blockId: string) => {
    setSelectedBlocks(prev => {
      const newBlocks = prev.includes(blockId) 
        ? prev.filter(b => b !== blockId)
        : [...prev, blockId];
      
      return newBlocks;
    });
  }, []);

  const toggleModule = useCallback((moduleId: string) => {
    const module = moduleBlocks.find(m => m.id === moduleId);
    if (!module) return;

    setActiveModules(prev => {
      const isActive = prev.includes(moduleId);
      if (isActive) {
        return prev.filter(m => m !== moduleId);
      } else {
        return [...prev, moduleId];
      }
    });

    // Enable required hooks for this module
    setSelectedBlocks(prev => {
      let newBlocks = [...prev];
      module.hooks.forEach(hookId => {
        if (!newBlocks.includes(hookId)) {
          newBlocks.push(hookId);
        }
      });
      return newBlocks;
    });
  }, []);

  // Start mining for valid hook address
  const startMining = useCallback((blocks: string[]) => {
    // Terminate existing worker if any
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }

    if (blocks.length === 0) {
      setMiningStatus('idle');
      setMinedAddress(null);
      setMiningAttempts(0);
      setMiningTimeMs(0);
      setMiningProgress(0);
      return;
    }

    // Create permissions object
    const permissions = {
      beforeSwap: blocks.includes('beforeSwap'),
      afterSwap: blocks.includes('afterSwap'),
      beforeAddLiquidity: blocks.includes('beforeAddLiquidity'),
      afterAddLiquidity: blocks.includes('afterAddLiquidity'),
      beforeRemoveLiquidity: blocks.includes('beforeRemoveLiquidity'),
      afterRemoveLiquidity: blocks.includes('afterRemoveLiquidity'),
    };

    // Create worker
    const worker = new Worker(
      new URL('../../lib/workers/addressMiner.worker.ts', import.meta.url)
    );
    workerRef.current = worker;

    setMiningStatus('mining');
    setMinedAddress(null);
    setMiningAttempts(0);
    setMiningTimeMs(0);

    worker.onmessage = (e) => {
      const { type, address, attempts, timeMs } = e.data;

      if (type === 'PROGRESS') {
        setMiningAttempts(attempts);
        setMiningTimeMs(timeMs);
        // Simulate progress (cap at 95% until found)
        setMiningProgress(Math.min(95, (attempts / 500000) * 100));
      } else if (type === 'FOUND') {
        setMinedAddress(address);
        setMiningStatus('found');
        setMiningAttempts(attempts);
        setMiningTimeMs(timeMs);
        setMiningProgress(100);
        worker.terminate();
        workerRef.current = null;
      } else if (type === 'TIMEOUT') {
        setMiningStatus('idle');
        setMiningAttempts(attempts);
        worker.terminate();
        workerRef.current = null;
      }
    };

    worker.postMessage({ permissions });
  }, []);

  // Copy address to clipboard
  const copyAddress = useCallback(() => {
    if (minedAddress) {
      navigator.clipboard.writeText(minedAddress);
      setCopyText('COPIED!');
      setTimeout(() => setCopyText('COPY'), 2000);
    }
  }, [minedAddress]);

  // Copy TX hash to clipboard
  const copyTxHash = useCallback(() => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      setCopyTxText('COPIED!');
      setTimeout(() => setCopyTxText('COPY'), 2000);
    }
  }, [txHash]);

  // Truncate address for display
  const truncateAddress = (addr: string) => {
    return addr.slice(0, 10) + '...' + addr.slice(-6);
  };

  // Flash green border on successful deploy
  const flashSuccess = useCallback(() => {
    if (pageRef.current) {
      pageRef.current.style.outline = '2px solid #00ff9d';
      pageRef.current.style.outlineOffset = '-2px';
      setTimeout(() => {
        if (pageRef.current) {
          pageRef.current.style.outline = 'none';
        }
      }, 1000);
    }
  }, []);

  // Handle deploy
  const handleDeploy = useCallback(async () => {
    if (!walletClient || !publicClient) {
      setErrorMessage('Wallet not connected');
      return;
    }

    setDeployStatus('deploying');
    setErrorMessage(null);
    setDeployStep('→ Preparing transaction...');

    try {
      // Step 1: Prepare and broadcast transaction
      setDeployStep('→ Broadcasting transaction...');
      
      const hash = await walletClient.deployContract({
        abi: [
          {
            inputs: [{ name: 'value', type: 'uint256' }],
            name: 'set',
            outputs: [{ name: '', type: 'uint256' }],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        bytecode: HOOK_BYTECODE,
        args: [],
      });

      setTxHash(hash);
      setDeployStep('→ Waiting for confirmation...');

      // Step 2: Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });

      setDeployStep('→ Block confirmation...');

      // Step 3: Update state on success
      setDeployedAddress(receipt.contractAddress || null);
      setBlockNumber(receipt.blockNumber.toString());
      setDeployStatus('confirmed');
      
      // Flash green border
      flashSuccess();

    } catch (error: unknown) {
      console.error('Deploy error:', error);
      setDeployStatus('error');
      
      // Check for user rejection
      if (error instanceof Error) {
        if (error.message.includes('rejected') || error.message.includes('denied')) {
          setErrorMessage('User rejected the transaction');
        } else {
          setErrorMessage(error.message.slice(0, 100));
        }
      } else {
        setErrorMessage('Unknown error occurred');
      }

      // Reset after 5 seconds
      setTimeout(() => {
        setDeployStatus('idle');
        setErrorMessage(null);
      }, 5000);
    }
  }, [walletClient, publicClient, flashSuccess]);

  // Update generated code when blocks or modules change
  useEffect(() => {
    const newCode = generateSolidityCode(selectedBlocks, activeModules);
    setGeneratedCode(newCode);

    // Update permission status
    if (selectedBlocks.length > 0) {
      setPermissionStatus('computing');
      const timer = setTimeout(() => {
        setPermissionStatus('set');
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setPermissionStatus('idle');
    }
  }, [selectedBlocks, activeModules, generateSolidityCode]);

  // Start mining when blocks change
  useEffect(() => {
    startMining(selectedBlocks);
    
    // Cleanup on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [selectedBlocks, startMining]);

  const isBlockActive = (blockId: string) => selectedBlocks.includes(blockId);
  const isModuleActive = (moduleId: string) => activeModules.includes(moduleId);
  const permissionBits = generatePermissionBits(selectedBlocks);

  return (
    <div 
      ref={pageRef}
      style={{ 
        fontFamily: monoFont, 
        background: '#0a0a0a', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'outline 0.3s ease',
      }}
    >
      {/* Page Header */}
      <div style={{
        height: '40px',
        background: '#0f0f0f',
        borderBottom: '1px solid #1a1a2e',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Link 
          href="/"
          style={{ 
            color: '#64748b', 
            fontSize: '12px', 
            fontFamily: monoFont,
            textDecoration: 'none',
          }}
        >
          FORGEKIT / HOOK BUILDER
        </Link>
        <span style={{ 
          color: '#00ff9d', 
          fontSize: '12px', 
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
        }}>
          · UNISWAP V4 HOOK COMPOSER
        </span>
        <span style={{
          background: 'rgba(245, 158, 11, 0.15)',
          color: '#f59e0b',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '4px 8px',
          fontSize: '11px',
          fontFamily: monoFont,
          textTransform: 'uppercase',
        }}>
          V4 CORE
        </span>
      </div>

      {/* Main Content - Three Columns */}
      <div style={{
        display: 'flex',
        flex: 1,
        height: 'calc(100vh - 40px)',
        overflow: 'hidden',
      }}>
        {/* LEFT PANEL - Lifecycle Blocks */}
        <div style={{
          width: '25%',
          background: '#0f0f0f',
          borderRight: '1px solid #1a1a2e',
          padding: '16px',
          overflowY: 'auto',
          flexShrink: 0,
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <span style={{ 
              color: '#64748b', 
              fontSize: '11px', 
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              LIFECYCLE BLOCKS
            </span>
            <span style={{ 
              color: '#64748b', 
              fontSize: '10px',
            }}>
              click to toggle
            </span>
          </div>

          {/* Hook Points */}
          <div style={{ marginTop: '16px' }}>
            <span style={{ 
              color: '#00ff9d', 
              fontSize: '11px', 
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              display: 'block',
            }}>
              · HOOK POINTS
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {lifecycleBlocks.map((block) => (
                <div
                  key={block.id}
                  onClick={() => toggleBlock(block.id)}
                  style={{
                    background: isBlockActive(block.id) ? '#1a1a3e' : '#111118',
                    border: `1px solid ${isBlockActive(block.id) ? '#7c3aed' : '#1a1a2e'}`,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isBlockActive(block.id)) {
                      e.currentTarget.style.borderColor = '#7c3aed';
                      e.currentTarget.style.background = '#111128';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isBlockActive(block.id)) {
                      e.currentTarget.style.borderColor = '#1a1a2e';
                      e.currentTarget.style.background = '#111118';
                    }
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: block.color,
                    boxShadow: isBlockActive(block.id) ? `0 0 8px ${block.color}` : 'none',
                  }} />
                  <span style={{ 
                    color: '#e2e8f0', 
                    fontSize: '11px', 
                    fontFamily: monoFont,
                    textTransform: 'uppercase',
                    flex: 1,
                  }}>
                    {block.name}
                  </span>
                  {isBlockActive(block.id) ? (
                    <span style={{
                      background: 'rgba(0, 255, 157, 0.15)',
                      color: '#00ff9d',
                      padding: '2px 6px',
                      fontSize: '9px',
                      fontFamily: monoFont,
                    }}>
                      ON
                    </span>
                  ) : (
                    <span style={{ color: '#64748b', fontSize: '12px' }}>⠿</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pre-built Modules */}
          <div style={{ marginTop: '24px' }}>
            <span style={{ 
              color: '#00ff9d', 
              fontSize: '11px', 
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              display: 'block',
            }}>
              · MODULES
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {moduleBlocks.map((block) => (
                <div
                  key={block.id}
                  onClick={() => toggleModule(block.id)}
                  style={{
                    background: isModuleActive(block.id) ? '#1a1a3e' : '#111118',
                    border: `1px solid ${isModuleActive(block.id) ? '#00ff9d' : '#1a1a2e'}`,
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isModuleActive(block.id)) {
                      e.currentTarget.style.borderColor = '#7c3aed';
                      e.currentTarget.style.background = '#111128';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isModuleActive(block.id)) {
                      e.currentTarget.style.borderColor = '#1a1a2e';
                      e.currentTarget.style.background = '#111118';
                    }
                  }}
                >
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: block.color,
                    boxShadow: isModuleActive(block.id) ? `0 0 8px ${block.color}` : 'none',
                  }} />
                  <span style={{ 
                    color: '#e2e8f0', 
                    fontSize: '11px', 
                    fontFamily: monoFont,
                    textTransform: 'uppercase',
                    flex: 1,
                  }}>
                    {block.name}
                  </span>
                  {isModuleActive(block.id) ? (
                    <span style={{
                      background: 'rgba(0, 255, 157, 0.15)',
                      color: '#00ff9d',
                      padding: '2px 6px',
                      fontSize: '9px',
                      fontFamily: monoFont,
                    }}>
                      ON
                    </span>
                  ) : (
                    <span style={{ color: '#64748b', fontSize: '10px' }}>⠿</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CENTER PANEL - Monaco Editor */}
        <div style={{
          width: '50%',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Editor Header */}
          <div style={{
            height: '36px',
            background: '#0f0f0f',
            borderBottom: '1px solid #1a1a2e',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <span style={{
              background: '#1a1a2e',
              color: '#e2e8f0',
              padding: '4px 12px',
              fontSize: '11px',
              fontFamily: monoFont,
            }}>
              Hook.sol
            </span>
            <span style={{ 
              color: '#64748b', 
              fontSize: '11px', 
              fontFamily: monoFont,
            }}>
              // auto-updating
            </span>
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1 }}>
            <MonacoEditor
              height="100%"
              defaultLanguage="sol"
              theme="vs-dark"
              value={generatedCode}
              onChange={(value) => setGeneratedCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                padding: { top: 16 },
                readOnly: false,
              }}
            />
          </div>
        </div>

        {/* RIGHT PANEL - Deploy */}
        <div style={{
          width: '25%',
          background: '#0f0f0f',
          borderLeft: '1px solid #1a1a2e',
          padding: '16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          flexShrink: 0,
        }}>
          {/* Address Miner */}
          <div>
            <span style={{ 
              color: '#64748b', 
              fontSize: '11px', 
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              display: 'block',
            }}>
              · ADDRESS MINER
            </span>
            <div style={{
              background: '#111118',
              border: '1px solid #1a1a2e',
              padding: '12px',
            }}>
              {/* Mining Status Text */}
              <div style={{ 
                color: miningStatus === 'mining' ? '#f59e0b' : miningStatus === 'found' ? '#00ff9d' : '#64748b', 
                fontSize: '11px', 
                fontFamily: monoFont,
                marginBottom: '8px',
                animation: miningStatus === 'mining' ? 'pulse 1.5s ease-in-out infinite' : 'none',
              }}>
                {miningStatus === 'idle' && '⚙ READY TO MINE'}
                {miningStatus === 'mining' && '⚙ MINING ADDRESS...'}
                {miningStatus === 'found' && '✓ VALID ADDRESS FOUND'}
              </div>

              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '4px',
                background: '#1a1a2e',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: miningStatus === 'found' ? '100%' : `${miningProgress}%`,
                  height: '100%',
                  background: miningStatus === 'found' ? '#00ff9d' : miningStatus === 'mining' ? '#f59e0b' : '#7c3aed',
                  transition: 'width 0.3s',
                  animation: miningStatus === 'mining' ? 'mining-bar 1s ease-in-out infinite' : 'none',
                }} />
              </div>

              {/* Mined Address Display */}
              {miningStatus === 'found' && minedAddress && (
                <div style={{
                  marginTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ 
                    color: '#06b6d4', 
                    fontSize: '10px', 
                    fontFamily: monoFont,
                    flex: 1,
                  }}>
                    ADDR: {truncateAddress(minedAddress)}
                  </span>
                  <button
                    onClick={copyAddress}
                    style={{
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      color: '#06b6d4',
                      padding: '2px 8px',
                      fontSize: '9px',
                      fontFamily: monoFont,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(6, 182, 212, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(6, 182, 212, 0.15)';
                    }}
                  >
                    {copyText}
                  </button>
                </div>
              )}

              {/* Permission Bits */}
              {selectedBlocks.length > 0 && (
                <div style={{ 
                  color: '#06b6d4', 
                  fontSize: '10px', 
                  fontFamily: monoFont,
                  marginTop: '8px',
                }}>
                  BITS: {permissionBits}
                </div>
              )}

              {/* Attempts and Time */}
              <div style={{ 
                color: '#64748b', 
                fontSize: '10px', 
                fontFamily: monoFont,
                marginTop: '4px',
              }}>
                {miningAttempts.toLocaleString()} ATTEMPTS
              </div>
              {miningStatus !== 'idle' && (
                <div style={{ 
                  color: '#64748b', 
                  fontSize: '10px', 
                  fontFamily: monoFont,
                  marginTop: '2px',
                }}>
                  {miningTimeMs}ms ELAPSED
                </div>
              )}
            </div>
          </div>

          {/* Chain Selector */}
          <div>
            <span style={{ 
              color: '#64748b', 
              fontSize: '11px', 
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              display: 'block',
            }}>
              · TARGET CHAIN
            </span>
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              style={{
                width: '100%',
                background: '#111118',
                border: '1px solid #1a1a2e',
                color: '#e2e8f0',
                padding: '10px 12px',
                fontSize: '11px',
                fontFamily: monoFont,
                textTransform: 'uppercase',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {chains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
          </div>

          {/* Permissions */}
          <div>
            <span style={{ 
              color: '#64748b', 
              fontSize: '11px', 
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '8px',
              display: 'block',
            }}>
              · PERMISSIONS
            </span>
            <div style={{
              background: '#111118',
              border: '1px solid #1a1a2e',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              {lifecycleBlocks.map((block) => (
                <div 
                  key={block.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '10px',
                    fontFamily: monoFont,
                  }}
                >
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isBlockActive(block.id) ? '#00ff9d' : '#64748b',
                  }} />
                  <span style={{ 
                    color: '#94a3b8', 
                    flex: 1,
                    textTransform: 'uppercase',
                  }}>
                    {block.name}
                  </span>
                  <span style={{
                    background: isBlockActive(block.id) ? 'rgba(0, 255, 157, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                    color: isBlockActive(block.id) ? '#00ff9d' : '#64748b',
                    padding: '2px 6px',
                    fontSize: '9px',
                  }}>
                    {isBlockActive(block.id) ? 'ON' : 'OFF'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deploy Button */}
          <div>
            {deployStatus === 'deploying' ? (
              // Deploying state
              <div style={{
                background: '#0f0f0f',
                border: '1px solid #1a1a2e',
                padding: '16px',
              }}>
                <div style={{ 
                  color: '#f59e0b', 
                  fontSize: '12px', 
                  fontFamily: monoFont,
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}>
                  ⚙ DEPLOYING TO POLYGON AMOY...
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: '#1a1a2e',
                  overflow: 'hidden',
                  marginBottom: '12px',
                }}>
                  <div style={{
                    width: '30%',
                    height: '100%',
                    background: '#f59e0b',
                    animation: 'mining-bar 1s ease-in-out infinite',
                  }} />
                </div>
                <div style={{ 
                  color: '#64748b', 
                  fontSize: '10px', 
                  fontFamily: monoFont,
                  lineHeight: '1.6',
                }}>
                  {deployStep}
                </div>
              </div>
            ) : deployStatus === 'error' ? (
              // Error state
              <div>
                <button
                  disabled
                  style={{
                    width: '100%',
                    background: '#ef4444',
                    color: '#0a0a0a',
                    border: 'none',
                    padding: '14px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    fontFamily: monoFont,
                    textTransform: 'uppercase',
                    cursor: 'not-allowed',
                    opacity: 0.8,
                  }}
                >
                  ✕ TRANSACTION FAILED
                </button>
                <div style={{ 
                  color: '#ef4444', 
                  fontSize: '10px', 
                  fontFamily: monoFont,
                  textAlign: 'center',
                  marginTop: '8px',
                }}>
                  {errorMessage?.includes('rejected') ? '// user rejected the transaction' : `// ${errorMessage}`}
                </div>
              </div>
            ) : deployStatus === 'confirmed' ? (
              // Confirmed state - button
              <button
                disabled
                style={{
                  width: '100%',
                  background: '#00ff9d',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '14px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  fontFamily: monoFont,
                  textTransform: 'uppercase',
                  cursor: 'default',
                }}
              >
                ✓ DEPLOYED SUCCESSFULLY
              </button>
            ) : (
              // Idle state
              <>
                <button
                  onClick={handleDeploy}
                  disabled={selectedBlocks.length === 0 || miningStatus === 'mining' || !isConnected}
                  style={{
                    width: '100%',
                    background: selectedBlocks.length === 0 || miningStatus === 'mining' 
                      ? '#64748b' 
                      : miningStatus === 'found' && isConnected
                        ? '#f59e0b' 
                        : '#64748b',
                    color: '#0a0a0a',
                    border: 'none',
                    padding: '14px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    fontFamily: monoFont,
                    textTransform: 'uppercase',
                    cursor: selectedBlocks.length === 0 || miningStatus === 'mining' || !isConnected ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: selectedBlocks.length === 0 || miningStatus === 'mining' ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedBlocks.length > 0 && miningStatus === 'found' && isConnected) {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBlocks.length > 0 && miningStatus === 'found' && isConnected) {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {selectedBlocks.length === 0 && '▶ SELECT HOOKS FIRST'}
                  {selectedBlocks.length > 0 && miningStatus === 'mining' && '⚙ MINING ADDRESS...'}
                  {selectedBlocks.length > 0 && miningStatus === 'found' && !isConnected && '▶ CONNECT WALLET TO DEPLOY'}
                  {selectedBlocks.length > 0 && miningStatus === 'found' && isConnected && '▶ DEPLOY HOOK'}
                  {selectedBlocks.length > 0 && miningStatus === 'idle' && '▶ DEPLOY HOOK'}
                </button>
                <div style={{ 
                  color: '#64748b', 
                  fontSize: '10px', 
                  fontFamily: monoFont,
                  textAlign: 'center',
                  marginTop: '8px',
                }}>
                  {selectedBlocks.length === 0 && '// select hooks from left panel'}
                  {selectedBlocks.length > 0 && miningStatus === 'mining' && '// mining valid hook address...'}
                  {selectedBlocks.length > 0 && miningStatus === 'found' && !isConnected && '// connect wallet to deploy'}
                  {selectedBlocks.length > 0 && miningStatus === 'found' && isConnected && '// ready to deploy'}
                  {selectedBlocks.length > 0 && miningStatus === 'idle' && '// ready to mine'}
                </div>
              </>
            )}
          </div>

          {/* Transaction Status - Show when confirmed */}
          {deployStatus === 'confirmed' && txHash && (
            <div style={{
              background: '#0a0a0a',
              borderLeft: '3px solid #00ff9d',
              padding: '16px',
            }}>
              {/* Header Row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}>
                <span style={{ 
                  color: '#00ff9d', 
                  fontSize: '11px', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  ● TRANSACTION CONFIRMED
                </span>
                <span style={{ 
                  color: '#64748b', 
                  fontSize: '9px', 
                  textTransform: 'uppercase',
                }}>
                  PROOF OF EXECUTION
                </span>
              </div>

              {/* TX Hash Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
              }}>
                <span style={{ 
                  color: '#64748b', 
                  fontSize: '10px', 
                  fontFamily: monoFont,
                }}>
                  TX HASH:
                </span>
                <span style={{ 
                  color: '#06b6d4', 
                  fontSize: '10px', 
                  fontFamily: monoFont,
                  flex: 1,
                }}>
                  {truncateAddress(txHash)}
                </span>
                <button
                  onClick={copyTxHash}
                  style={{
                    background: 'rgba(6, 182, 212, 0.15)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    color: '#06b6d4',
                    padding: '2px 8px',
                    fontSize: '9px',
                    fontFamily: monoFont,
                    cursor: 'pointer',
                  }}
                >
                  {copyTxText}
                </button>
              </div>

              {/* Block Number */}
              <div style={{ 
                color: '#64748b', 
                fontSize: '10px', 
                fontFamily: monoFont,
                marginBottom: '4px',
              }}>
                BLOCK: #{blockNumber}
              </div>

              {/* Contract Address */}
              {deployedAddress && (
                <div style={{ 
                  color: '#64748b', 
                  fontSize: '10px', 
                  fontFamily: monoFont,
                  marginBottom: '4px',
                }}>
                  CONTRACT: <span style={{ color: '#06b6d4' }}>{truncateAddress(deployedAddress)}</span>
                </div>
              )}

              {/* Network */}
              <div style={{ 
                color: '#64748b', 
                fontSize: '10px', 
                fontFamily: monoFont,
                marginBottom: '16px',
              }}>
                NETWORK: Polygon Amoy (Chain 80002)
              </div>

              {/* Status Messages */}
              <div style={{ 
                borderTop: '1px solid #1a1a2e', 
                paddingTop: '12px',
              }}>
                <div style={{ 
                  color: '#00ff9d', 
                  fontSize: '10px', 
                  fontFamily: monoFont,
                  textTransform: 'uppercase',
                }}>
                  ● HOOK REGISTERED ON-CHAIN
                </div>
                <div style={{ 
                  color: '#00ff9d', 
                  fontSize: '10px', 
                  fontFamily: monoFont,
                  textTransform: 'uppercase',
                  marginTop: '4px',
                }}>
                  ● READY TO ATTACH TO POOL
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes mining-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
