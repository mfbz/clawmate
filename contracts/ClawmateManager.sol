// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import './ClawmateToken.sol';

contract ClawmateManager is IERC721Receiver, Ownable, ReentrancyGuard {
	// A structure for the nfts dunked in the pool
	struct Nft {
		address token;
		uint id;
	}

	// Default reward value useful for testing in CLAW
	uint public constant DEFAULT_TOKEN_REWARD = 141000000000000000000;
	// Default grab price in CLAW
	uint public constant DEFAULT_GRAB_PRICE = 150000000000000000;

	// The main contract handling claw token
	ClawmateToken public clawContract;

	// NFT contracts whitelisted so that they can be dumped here
	mapping(address => bool) public tokenToAllowed;
	// NFT contracts coins per token (NB: this value should be updated dynamically or obtained through another contract call)
	mapping(address => uint) public tokenToReward;

	// To save dunked tokens having a reference for grabbing
	Nft[] public tokens;

	// The price in CLAW tokens to grab a token from the box
	uint public grabPrice;

	// Events
	event TokenDunked(address _from, address _token, uint _id, uint _reward);
	event TokenGrabbed(address _from, address _token, uint _id, uint _price);

	// Ownable constructor
	constructor(address _initialOwner) Ownable(_initialOwner) {
		// Create claw token becoming its owner so that we can execute owner functions directly here
		clawContract = new ClawmateToken(address(this));
		// Set default grab price
		grabPrice = DEFAULT_GRAB_PRICE;
	}

	function updateTokenAllowed(address _token, bool _allowed) external onlyOwner {
		tokenToAllowed[_token] = _allowed;
	}

	function updateTokenReward(address _token, uint _reward) external onlyOwner {
		tokenToReward[_token] = _reward;
	}

	function updateGrabPrice(uint _price) external onlyOwner {
		grabPrice = _price;
	}

	function onERC721Received(
		address _operator,
		address _from,
		uint256 _tokenId,
		bytes calldata _data
	) external returns (bytes4) {
		// NB: COMMENTED SO THAT ON TESTNET WE CAN USE ANY KIND OF TOKEN WE WANT
		// TODO REMOVE COMMENTS ONCE ON PRODUCTION AND SET THESE VALUES
		// Check that the token is allowed
		//require(tokenToAllowed[msg.sender], 'Token not allowed');
		// Check token reward set
		//require(tokenToReward[msg.sender] > 0, 'Invalid token reward');

		// TODO
		uint reward = tokenToReward[msg.sender] > 0 ? tokenToReward[msg.sender] : DEFAULT_TOKEN_REWARD;

		// Add token to nfts pool
		tokens.push(Nft({token: msg.sender, id: _tokenId}));
		// Mint reward
		clawContract.mintTo(_from, reward);

		// Emit even
		emit TokenDunked(_from, msg.sender, _tokenId, reward);

		// Return selected to mark as handled
		return this.onERC721Received.selector;
	}

	function grabToken() external nonReentrant {
		// Require that sender has at least enough tokens to grab
		require(clawContract.allowance(msg.sender, address(this)) >= grabPrice, 'Not enough token allowance');
		// Require that there is at least 1 token deposited
		require(tokens.length > 0, 'No tokens to grab');

		// Deposit claw coins
		//clawContract.transferFrom(msg.sender, address(this), grabPrice);
		// Burn claw coins
		clawContract.burnFrom(msg.sender, grabPrice);

		// NB: Obviously it would be better to use an oracle to have it truly random but let's that sink in for this mvp :D
		// Get a pseudo random number indicating the token to be grabbed based on tokens array length
		uint indexToGrab = pseudoRandom() % tokens.length;
		// Get associated nft
		Nft memory nftToGrab = tokens[indexToGrab];
		// Transfer nft from contract to sender safely
		IERC721(nftToGrab.token).safeTransferFrom(address(this), msg.sender, nftToGrab.id);

		// Update tokens array removing grabbed index
		tokens[indexToGrab] = tokens[tokens.length - 1];
		tokens.pop();

		// Emit final event
		emit TokenGrabbed(msg.sender, nftToGrab.token, nftToGrab.id, grabPrice);
	}

	function getTokens() external view returns (Nft[] memory) {
		Nft[] memory tokensArray = new Nft[](tokens.length);
		for (uint i = 0; i < tokens.length; i++) {
			tokensArray[i] = tokens[i];
		}
		return tokensArray;
	}

	function getTokenAllowed(address _token) external view returns (bool) {
		return tokenToAllowed[_token];
	}

	function getTokenReward(address _token) external view returns (uint256) {
		// TODO REMOVE BECAUSE ON PROD THERE IS NO DEFAULT
		return tokenToReward[_token] > 0 ? tokenToReward[_token] : DEFAULT_TOKEN_REWARD;
	}

	function pseudoRandom() internal view returns (uint256) {
		return uint256(keccak256(abi.encodePacked(tx.origin, blockhash(block.number - 1), block.timestamp)));
	}
}
