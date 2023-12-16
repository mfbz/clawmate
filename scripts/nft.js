const { ethers } = require('hardhat');

// Load env variables
require('dotenv').config();

const nftContractAddress = '0xc79838Dd48374599D179748Baeeb6564E7B9b49B';
const toAddress = '0x93840623bc378e9ee5334c0eE4608CF877dC68D3';

async function main() {
	const nftContract = (await ethers.getContractFactory('ExampleNft')).attach(nftContractAddress);

	// Deploy example nfts
	await nftContract.safeMint(
		toAddress,
		'https://i2c.seadn.io/ethereum/0xed5af388653567af2f388e6224dc7c4b3241c544/2989/5106bb46e8121d5f510ae2bb7f8cfcac.png',
	);
	await nftContract.safeMint(
		toAddress,
		'https://i2c.seadn.io/ethereum/0xed5af388653567af2f388e6224dc7c4b3241c544/9615/e9011a8f99803c488763c19d59530bdf.png',
	);
	await nftContract.safeMint(
		toAddress,
		'https://i2c.seadn.io/ethereum/0xed5af388653567af2f388e6224dc7c4b3241c544/9596/9024d4dc96e68533bf06d0857c2b9735.png',
	);
	await nftContract.safeMint(toAddress, 'https://i.seadn.io/s/raw/files/36209b2da0380b785ec363bfc8c9bd19.png');
	await nftContract.safeMint(toAddress, 'https://i.seadn.io/gcs/files/04d4a3852c4e17f02869832b2a65a1b0.png');
	await nftContract.safeMint(toAddress, 'https://metadata.degods.com/g/6741-dead.png');
	await nftContract.safeMint(toAddress, 'https://metadata.degods.com/g/1180-dead.png');
	await nftContract.safeMint(toAddress, 'https://i.seadn.io/gcs/files/61642f23bd07c7808944c780e29e19de.png');
	await nftContract.safeMint(toAddress, 'https://i.seadn.io/gcs/files/982a7f5177af12c1c73349eeddaac020.png');
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
