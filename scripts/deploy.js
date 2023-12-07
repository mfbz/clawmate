const { ethers } = require('hardhat');

// Load env variables
require('dotenv').config();

async function main() {
	const deployerAddress = process.env.HARDHAT_INJECTIVE_ACCOUNT_ADDRESS;
	const deployer = await ethers.getSigner(deployerAddress);

	console.log(`Deploying contracts with the account: ${deployer.address}`);
	console.log(`Account balance: ${(await deployer.provider.getBalance(deployerAddress)).toString()}`);

	const contractsToDeploy = ['ClawmateManager', 'ExampleNft'];

	for (const name of contractsToDeploy) {
		const Contract = await ethers.getContractFactory(name);
		const contract = await Contract.deploy(deployerAddress);
		await contract.waitForDeployment();

		const contractAddress = await contract.getAddress();
		console.log(`${name} contract deployed: ${contractAddress}`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
