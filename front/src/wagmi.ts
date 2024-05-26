import { http, createConfig } from 'wagmi'
// import { mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

import {moonbaseAlpha} from 'wagmi/chains';

import { type Chain } from 'viem'

export const config = createConfig({
  chains: [moonbaseAlpha],
  connectors: [injected()],
  transports: {
    [moonbaseAlpha.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}