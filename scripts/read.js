const { ethers } = require('hardhat');

// Load env variables
require('dotenv').config();

const managerContractAddress = '0x9c423c37215ed2D74dC9CD759073d285DFCD50F2';

async function main() {
	const managerContract = (await ethers.getContractFactory('ClawmateManager')).attach(managerContractAddress);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
