// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NftCollection
 * @dev ERC-721 Token with Maximum Supply and Owner-only Minting.
 */
contract NftCollection is ERC721, Ownable {
    uint256 public maxSupply;
    uint256 public totalSupply;
    string private _baseTokenURI;

    // Event emitted when a new token is created
    event Minted(address indexed to, uint256 indexed tokenId);

    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply,
        string memory baseURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        require(_maxSupply > 0, "Max supply must be greater than zero");
        maxSupply = _maxSupply;
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Mints a new token to the specified address.
     * Reverts if max supply is reached or caller is not owner.
     * @param to The address to receive the minted token.
     */
    function safeMint(address to) public onlyOwner {
        require(totalSupply < maxSupply, "Max supply reached");
        
        // Token IDs start at 1 and increment
        uint256 tokenId = totalSupply + 1;
        totalSupply++;
        
        _safeMint(to, tokenId);
        emit Minted(to, tokenId);
    }

    /**
     * @dev Base URI for computing {tokenURI}.
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Updates the base URI in case of metadata migration.
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
}