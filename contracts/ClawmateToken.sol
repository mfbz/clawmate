// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract ClawmateToken is ERC20, ERC20Burnable, Ownable {
	constructor(address initialOwner) ERC20('ClawmateToken', 'CLAW') Ownable(initialOwner) {}

	function mintTo(address to, uint256 amount) public onlyOwner {
		_mint(to, amount);
	}

	function burnFrom(address from, uint256 amount) public override onlyOwner {
		super.burnFrom(from, amount);
	}
}
