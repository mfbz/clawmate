const { ethers } = require('hardhat');

// Load env variables
require('dotenv').config();

const managerContractAddress = '0x0185e619766a7B4b2664B1aacA38A5c1C3e75dD3';
const tokenContractAddress = '0x3cB9f6b7f82Cf69f60bEa53fEDC0c96dCF0bae37';
const nftContractAddress = '0xc79838Dd48374599D179748Baeeb6564E7B9b49B';

async function main() {
	const managerContract = (await ethers.getContractFactory('ClawmateManager')).attach(managerContractAddress);
	const tokenContract = (await ethers.getContractFactory('ClawmateToken')).attach(tokenContractAddress);
	const nftContract = (await ethers.getContractFactory('ExampleNft')).attach(nftContractAddress);

	console.log(`ClawmateToken contract address: ${await managerContract.clawContract()}`);
	console.log(`Nft uri: ${await nftContract.tokenURI(1)}`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
