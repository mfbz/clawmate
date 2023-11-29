const { ethers } = require('hardhat');

// Load env variables
require('dotenv').config();

async function main() {
	const deployerAddress = process.env.HARDHAT_INJECTIVE_ACCOUNT_ADDRESS;
	const deployer = await ethers.getSigner(deployerAddress);

	console.log(`Deploying contracts with the account: ${deployer.address}`);
	console.log(`Account balance: ${(await deployer.provider.getBalance(deployerAddress)).toString()}`);

	const Contract = await ethers.getContractFactory('ClawmateManager');
	const contract = await Token.deploy(deployerAddress);
	await contract.waitForDeployment();

	const contractAddress = await contract.getAddress();

	console.log(`ClawmateManager contract deployed`);
	console.log(`Contract address is ${contractAddress}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
