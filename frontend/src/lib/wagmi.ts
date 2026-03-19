import { createConfig, http } from 'wagmi'
import { polygonAmoy, polygon, base, arbitrum, mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [polygonAmoy, polygon, base, arbitrum, mainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [polygonAmoy.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
