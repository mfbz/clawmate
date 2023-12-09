const { ethers } = require('hardhat');

// Load env variables
require('dotenv').config();

const managerContractAddress = '0xA93183e5E583e4698370215447aea53Bf89eeA09';
const tokenContractAddress = '0x0D6Dd4bA7300Fd8858Ab0fB854917C6772b1428f';
const nftContractAddress = '0xc79838Dd48374599D179748Baeeb6564E7B9b49B';

async function main() {
	const managerContract = (await ethers.getContractFactory('ClawmateManager')).attach(managerContractAddress);
	const tokenContract = (await ethers.getContractFactory('ClawmateToken')).attach(tokenContractAddress);
	const nftContract = (await ethers.getContractFactory('ExampleNft')).attach(nftContractAddress);

	await managerContract.updateGrabPrice(BigInt(15450000000000000000));
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
