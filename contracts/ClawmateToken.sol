// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract ClawmateToken is ERC20, ERC20Burnable, Ownable {
	constructor(address _initialOwner) ERC20('ClawmateToken', 'CLAW') Ownable(_initialOwner) {}

	function mintTo(address _to, uint256 _amount) public onlyOwner {
		_mint(_to, _amount);
	}

	function burnFrom(address _from, uint256 _amount) public override onlyOwner {
		super.burnFrom(_from, _amount);
	}
}
