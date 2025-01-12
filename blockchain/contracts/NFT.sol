// contracts/NFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

error notSupported();
error fallbackDisabled();

contract NFT is ERC721URIStorage, ReentrancyGuard {
    uint256 public nextTokenId;
    mapping(uint256 => uint256) public tokenPrices; // Maps token ID to price
    mapping(uint256 => bool) public tokenForSale;  // Tracks tokens marked for sale
    mapping(address => uint256[]) public ownerNFTs;

    event TokenMinted(address indexed owner, uint256 indexed tokenId, string tokenURI);
    event TokenPriceSet(uint256 indexed tokenId, uint256 price);
    event TokenSold(uint256 indexed tokenId, address indexed from, address indexed to, uint256 price);

    constructor() ERC721("DemoNFT", "DNFT") {}

    /**
     * @dev Mint a new NFT.
     * @param _tokenURI The metadata URI for the NFT.
     */
    function mintNFT(string memory _tokenURI) external nonReentrant {
        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        ownerNFTs[msg.sender].push(tokenId);

        emit TokenMinted(msg.sender, tokenId, _tokenURI);
    }

    /**
     * @dev Set the price for an NFT.
     * @param _tokenId The token ID.
     * @param _price The price in wei.
     */
    function setPrice(uint256 _tokenId, uint256 _price) external nonReentrant {
        require(ownerOf(_tokenId) == msg.sender, "No Owner");
        require(_price > 0, "Invalid Price");

        tokenPrices[_tokenId] = _price;
        tokenForSale[_tokenId] = true;

        emit TokenPriceSet(_tokenId, _price);
    }

    /**
     * @dev Buy an NFT that is for sale.
     * @param _tokenId The token ID to purchase.
     */
    function buyNFT(uint256 _tokenId) external payable nonReentrant {
        require(tokenForSale[_tokenId], "Not For sale");
        require(msg.value == tokenPrices[_tokenId], "Incorrect price.");

        address seller = ownerOf(_tokenId);
        require(seller != msg.sender, "Not Allowed");

        // Transfer funds to the seller
        (bool success, ) = seller.call{value: msg.value}("");
        require(success, "Failed");

        // Transfer token ownership
        _transfer(seller, msg.sender, _tokenId);

        // Mark as not for sale
        tokenForSale[_tokenId] = false;
        tokenPrices[_tokenId] = 0;

        emit TokenSold(_tokenId, seller, msg.sender, msg.value);
    }

    /**
     * @dev Get all available NFTs
     */
    function getAllNFTs() public view returns (uint256[] memory, string[] memory) {
        uint256 totalNFTs = nextTokenId;
        uint256[] memory tokenIds = new uint256[](totalNFTs);
        string[] memory tokenURIs = new string[](totalNFTs);

        for (uint256 i = 0; i < totalNFTs; i++) {
            tokenIds[i] = i;
            tokenURIs[i] = tokenURI(i);
        }

        return (tokenIds, tokenURIs);
    }

    /**
    * @dev Get all NFT owned by user
     */
    function getMyNFTs() public view returns (uint256[] memory, string[] memory) {
        uint256 totalNFTs = ownerNFTs[msg.sender].length;
        uint256[] memory tokenIds = ownerNFTs[msg.sender];
        string[] memory tokenURIs = new string[](totalNFTs);

        for (uint256 i = 0; i < totalNFTs; i++) {
            tokenURIs[i] = tokenURI(tokenIds[i]);
        }

        return (tokenIds, tokenURIs);
    }


    /**
     * @dev Fallback and receive functions to prevent accidental Ether transfers.
     */
    receive() external payable {
        revert notSupported();
    }

    fallback() external payable {
        revert fallbackDisabled();
    }
}