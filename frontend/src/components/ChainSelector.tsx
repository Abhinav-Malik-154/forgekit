'use client'

import { useChainId, useChains } from 'wagmi'

const monoStyle = {
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
}

export function ChainSelector() {
  const chainId = useChainId()
  const chains = useChains()
  const currentChain = chains.find(c => c.id === chainId)

  return (
    <div
      style={{
        ...monoStyle,
        border: '1px solid #374151',
        borderRadius: '3px',
        color: '#e2e8f0',
        padding: '8px 14px',
        fontSize: '12px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        background: 'rgba(55, 65, 81, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <span style={{ color: '#00ff9d' }}>●</span>
      {currentChain?.name ?? 'POLYGON AMOY'} ▼
    </div>
  )
}
