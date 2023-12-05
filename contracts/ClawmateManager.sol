// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import './ClawmateToken.sol';

contract ClawmateManager is IERC721Receiver, Ownable, ReentrancyGuard {
	struct Nft {
		address token;
		uint id;
	}

	// The main multitoken contract that handles shares
	ClawmateToken public clawContract;

	// NFT contracts whitelisted so that they can be dumped here
	mapping(address => bool) public tokenToAllowed;
	// NFT contracts coins per token (NB: this value should be updated dynamically or obtained through another contract call)
	mapping(address => uint) public tokenToReward;

	// To save dunked tokens having a reference for grabbing
	Nft[] public tokens;

	// The price in CLAW tokens to grab a token from the box
	uint public grabPrice;
	// The fee for Clawmate! Shouldn't we be profitable? :)
	uint public grabFee;

	// Events
	event TokenDunked(address _token, uint _id, uint _reward);
	event TokenGrabbed(address _token, uint _id, uint _price);

	constructor(address _initialOwner) Ownable(_initialOwner) {
		// Create claw token becoming its owner so that we can execute owner functions directly here
		clawContract = new ClawmateToken(address(this));
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

	function updateGrabFee(uint _fee) external onlyOwner {
		grabFee = _fee;
	}

	function onERC721Received(
		address _operator,
		address _from,
		uint256 _tokenId,
		bytes calldata _data
	) external returns (bytes4) {
		// Check that the token is allowed
		require(tokenToAllowed[msg.sender], 'Token not allowed');
		// Check token reward set
		require(tokenToReward[msg.sender] > 0, 'Invalid token reward');

		// Add token to nfts pool
		tokens.push(Nft({token: msg.sender, id: _tokenId}));
		// Mint reward
		clawContract.mintTo(_from, tokenToReward[msg.sender]);

		// Emit even
		emit TokenDunked(msg.sender, _tokenId, tokenToReward[msg.sender]);

		// Return selected to mark as handled
		return this.onERC721Received.selector;
	}

	function grabToken() external {
		// TODO
	}

	function getTokens() external view returns (Nft[] memory) {
		Nft[] memory tokensArray = new Nft[](tokens.length);
		for (uint i = 0; i < tokens.length; i++) {
			tokensArray[i] = tokens[i];
		}
		return tokensArray;
	}
}
