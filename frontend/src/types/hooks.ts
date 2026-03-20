// Hook Builder related types

export interface LifecycleBlock {
  id: string;
  name: string;
  color: string;
  bit: number;
  description?: string;
}

export interface ModuleBlock {
  id: string;
  name: string;
  color: string;
  hooks: string[];
  description?: string;
}

export interface HookPermissions {
  beforeInitialize: boolean;
  afterInitialize: boolean;
  beforeAddLiquidity: boolean;
  afterAddLiquidity: boolean;
  beforeRemoveLiquidity: boolean;
  afterRemoveLiquidity: boolean;
  beforeSwap: boolean;
  afterSwap: boolean;
  beforeDonate: boolean;
  afterDonate: boolean;
  beforeSwapReturnDelta: boolean;
  afterSwapReturnDelta: boolean;
  afterAddLiquidityReturnDelta: boolean;
  afterRemoveReturnDelta: boolean;
}

export interface HookBuilderState {
  selectedBlocks: string[];
  activeModules: string[];
  generatedCode: string;
  minedAddress: string | null;
}
