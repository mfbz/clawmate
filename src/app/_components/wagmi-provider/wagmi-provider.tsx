'use client';

import React from 'react';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { Chain } from 'wagmi/chains';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';

// https://wagmi.sh/react/getting-started
// https://wagmi.sh/examples/connect-wallet
// https://docs.walletconnect.com/web3modal/nextjs/about

// Custom injective testnet
const injectiveTestnet = {
	id: 1_738,
	name: 'Injective Testnet',
	network: 'injective',
	nativeCurrency: {
		decimals: 18,
		name: 'Injective',
		symbol: 'INJ',
	},
	rpcUrls: {
		default: { http: ['https://inevm-rpc.caldera.dev/'] },
		public: { http: ['https://inevm-rpc.caldera.dev/'] },
	},
	blockExplorers: {
		etherscan: { name: 'InjectiveScope', url: 'https://inevm.calderaexplorer.xyz/' },
		default: { name: 'InjectiveScope', url: 'https://inevm.calderaexplorer.xyz/' },
	},
} as const satisfies Chain;

// Configure chains & providers with the Alchemy provider
const { chains, publicClient, webSocketPublicClient } = configureChains([injectiveTestnet], [publicProvider()]);

// Set up wagmi config
const wagmiConfig = createConfig({
	autoConnect: true,
	connectors: [new MetaMaskConnector({ chains })],
	publicClient,
	webSocketPublicClient,
});

export const WagmiProvider = function WagmiProvider({ children }: React.PropsWithChildren) {
	// Prevent nextjs 13 hydratation problem
	// https://github.com/wagmi-dev/create-wagmi/blob/main/templates/next/default/src/app/providers.tsx
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);

	return <WagmiConfig config={wagmiConfig}>{mounted && children}</WagmiConfig>;
};
