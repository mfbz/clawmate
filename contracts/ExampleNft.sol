// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Base64.sol';

contract ExampleNft is ERC721, Ownable {
	uint256 private _nextTokenId;

	mapping(uint => string) idToImage;

	constructor(address _initialOwner) ERC721('ExampleNft', 'EXNFT') Ownable(_initialOwner) {}

	function safeMint(address _to, string memory image) public onlyOwner {
		uint256 tokenId = _nextTokenId++;
		idToImage[tokenId] = image;
		_safeMint(_to, tokenId);
	}

	function tokenURI(uint256 _tokenId) public view override returns (string memory) {
		// Return stringified data uri
		return
			string(
				abi.encodePacked(
					'data:application/json;base64,',
					Base64.encode(
						bytes(
							string(
								abi.encodePacked(
									'{ "name": "Example Nft #',
									Strings.toString(_tokenId),
									'", "description": "A nft to be used as an example.", "image": "',
									idToImage[_tokenId],
									'}'
								)
							)
						)
					)
				)
			);
	}
}
