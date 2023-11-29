// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract ClawmateManager is Ownable, ReentrancyGuard {
	mapping(address => bool) public whitelistedContracts;

	constructor(address initialOwner) Ownable(initialOwner) {
		// TODO
	}
}
