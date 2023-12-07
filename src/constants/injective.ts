export type NetworkType = 'testnet' | 'mainnet';

export const NETWORK_DATA_MAP = {
	mainnet: {
		general: {
			injectivePrice: 18,
		},
		contracts: {
			ClawmateManager: {
				address: '',
			},
			ClawmateToken: {
				address: '',
			},
		},
	},
	testnet: {
		general: {
			injectivePrice: 18,
		},
		contracts: {
			ClawmateManager: {
				address: '0x0185e619766a7B4b2664B1aacA38A5c1C3e75dD3',
			},
			ClawmateToken: {
				address: '0x3cB9f6b7f82Cf69f60bEa53fEDC0c96dCF0bae37',
			},
		},
	},
};

export class InjectiveConstants {
	// This defines the network to be used through the app (mainnet or testnet) loaded through env
	public static NETWORK_TYPE = (process.env.NEXT_PUBLIC_NETWORK_TYPE || 'testnet') as NetworkType;
	// This is always used to access network data
	public static NETWORK_DATA = NETWORK_DATA_MAP[InjectiveConstants.NETWORK_TYPE];
}
