require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
	solidity: {
		version: '0.8.20',
		settings: {
			optimizer: {
				enabled: true,
				runs: 2000,
			},
		},
	},
	networks: {
		caldera: {
			url: process.env.HARDHAT_INJECTIVE_CALDERA_TESTNET_URL || '',
			accounts:
				process.env.HARDHAT_INJECTIVE_ACCOUNT_PRIVATE_KEY !== undefined
					? [process.env.HARDHAT_INJECTIVE_ACCOUNT_PRIVATE_KEY]
					: [],
		},
	},
};
