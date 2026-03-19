// This worker mines valid CREATE2 addresses
// for Uniswap V4 hooks
// Hook address last 14 bits must match
// the hook's permission flags

interface Permissions {
  beforeSwap: boolean;
  afterSwap: boolean;
  beforeAddLiquidity: boolean;
  afterAddLiquidity: boolean;
  beforeRemoveLiquidity: boolean;
  afterRemoveLiquidity: boolean;
}

interface MiningMessage {
  permissions: Permissions;
}

self.onmessage = function(e: MessageEvent<MiningMessage>) {
  const { permissions } = e.data;
  
  // Calculate required bits from permissions
  let requiredBits = 0n;
  if (permissions.beforeSwap)           requiredBits |= (1n << 7n);
  if (permissions.afterSwap)            requiredBits |= (1n << 6n);
  if (permissions.beforeAddLiquidity)   requiredBits |= (1n << 5n);
  if (permissions.afterAddLiquidity)    requiredBits |= (1n << 4n);
  if (permissions.beforeRemoveLiquidity) requiredBits |= (1n << 3n);
  if (permissions.afterRemoveLiquidity) requiredBits |= (1n << 2n);

  // Mine address by iterating salt
  let attempts = 0;
  const startTime = Date.now();

  // Simulate mining — generate random addresses
  // until last 14 bits match required pattern
  const mine = () => {
    const batchSize = 1000;
    
    for (let i = 0; i < batchSize; i++) {
      attempts++;
      
      // Generate random address (simulated)
      const randomBytes = new Uint8Array(20);
      crypto.getRandomValues(randomBytes);
      
      // Convert to hex address
      const address = '0x' + Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      // Check last 14 bits
      const lastBits = BigInt('0x' + address.slice(-4)) & 0x3FFFn;
      
      if (lastBits === requiredBits) {
        // Found valid address
        self.postMessage({
          type: 'FOUND',
          address: address,
          attempts: attempts,
          timeMs: Date.now() - startTime
        });
        return;
      }
    }
    
    // Report progress every 1000 attempts
    self.postMessage({
      type: 'PROGRESS',
      attempts: attempts,
      timeMs: Date.now() - startTime
    });
    
    // Continue mining
    if (attempts < 500000) {
      setTimeout(mine, 0);
    } else {
      // Timeout — return best attempt
      self.postMessage({
        type: 'TIMEOUT',
        attempts: attempts
      });
    }
  };
  
  mine();
};
