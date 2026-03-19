'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useState } from 'react'

const monoStyle = {
  fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
}

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [isOpen, setIsOpen] = useState(false)

  if (isConnected && address) {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            ...monoStyle,
            background: '#00ff9d15',
            border: '1px solid #00ff9d40',
            color: '#00ff9d',
            padding: '6px 16px',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
        >
          ● {address.slice(0, 6)}...{address.slice(-4)}
        </button>
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: '4px',
              background: '#0f0f0f',
              border: '1px solid #1a1a2e',
              padding: '4px',
              zIndex: 100,
            }}
          >
            <button
              onClick={() => { disconnect(); setIsOpen(false) }}
              style={{
                ...monoStyle,
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                padding: '8px 16px',
                fontSize: '11px',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                display: 'block',
                width: '100%',
                textAlign: 'left' as const,
              }}
            >
              DISCONNECT
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      style={{
        ...monoStyle,
        background: '#f59e0b',
        border: 'none',
        color: '#0a0a0a',
        padding: '6px 16px',
        fontSize: '11px',
        fontWeight: 'bold',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.1em',
        cursor: 'pointer',
      }}
    >
      ▶ CONNECT WALLET
    </button>
  )
}
