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
				address: '0xA93183e5E583e4698370215447aea53Bf89eeA09',
			},
			ClawmateToken: {
				address: '0x0D6Dd4bA7300Fd8858Ab0fB854917C6772b1428f',
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
