// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import './ClawmateToken.sol';

contract ClawmateManager is Ownable, ReentrancyGuard {
	// The main multitoken contract that handles shares
	ClawmateToken public clawtoken;

	// NFT contracts whitelisted so that they can be dumped here
	mapping(address => bool) public whitelistedContracts;

	constructor(address initialOwner) Ownable(initialOwner) {
		// Create claw token becoming its owner so that we can execute owner functions directly here
		clawtoken = new ClawmateToken(address(this));
	}
}
