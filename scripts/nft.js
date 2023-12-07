const { ethers } = require('hardhat');

// Load env variables
require('dotenv').config();

const nftContractAddress = '0xc79838Dd48374599D179748Baeeb6564E7B9b49B';
const toAddress = '0x93840623bc378e9ee5334c0eE4608CF877dC68D3';

async function main() {
	const nftContract = (await ethers.getContractFactory('ExampleNft')).attach(nftContractAddress);

	// Deploy example nfts
	await nftContract.safeMint(toAddress, 'https://i.seadn.io/gcs/files/9738dbaf9e5286ef77c1a49e1df495f4.png');
	await nftContract.safeMint(toAddress, 'https://i.seadn.io/gcs/files/5bdcf7f2c01fbe2a6820024b65f15e59.png');
	await nftContract.safeMint(toAddress, 'https://metadata.degods.com/g/7724-s3-male.png');
	await nftContract.safeMint(toAddress, 'https://metadata.degods.com/g/9670-dead.png');
	await nftContract.safeMint(toAddress, 'https://i.seadn.io/s/raw/files/3c8627ceced8bda42d6626f229820b0b.png');
	await nftContract.safeMint(toAddress, 'https://i.seadn.io/s/raw/files/6d2b9e29439f6201a67b9d9fdd5fd55e.png');
	await nftContract.safeMint(toAddress, 'https://i.seadn.io/s/raw/files/daccddc707c4817da36929037a5fc9a1.png');
	await nftContract.safeMint(toAddress, 'https://metadata.degods.com/g/4284-dead.png');
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
