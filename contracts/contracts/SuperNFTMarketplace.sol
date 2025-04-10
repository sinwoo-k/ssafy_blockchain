// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SuperNFTMarketplace is ERC721Enumerable, Ownable {
    uint256 private _nextTokenId = 1;

    struct Listing {
        address seller;
        uint256 price;
        bool    active;
    }

    mapping(uint256 => Listing) public listings;

    event NFTRegistered(uint256 indexed tokenId, address indexed owner, string tokenURI);
    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed buyer, uint256 price);

    constructor() ERC721("SuperNFT", "SNFT") {}

    // 1) NFT 등록 (민팅)
    function registerNFT(address to, string calldata uri) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit NFTRegistered(tokenId, to, uri);
        return tokenId;
    }

    // 2) NFT 판매 등록
    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Only owner");
        require(price > 0, "Price>0");
        listings[tokenId] = Listing(msg.sender, price, true);
        emit NFTListed(tokenId, msg.sender, price);
    }

    // 3) NFT 구매
    function buyNFT(uint256 tokenId) external payable {
        Listing storage l = listings[tokenId];
        require(l.active, "Not listed");
        require(msg.value >= l.price, "Insufficient");
        address seller = l.seller;

        // 전액 송금
        payable(seller).transfer(msg.value);

        // 소유권 이전
        _transfer(seller, msg.sender, tokenId);
        l.active = false;

        emit NFTSold(tokenId, msg.sender, msg.value);
    }

    // 4) 지갑 잔액 조회 (view)
    function getBalance(address user) external view returns (uint256) {
        return user.balance;
    }

    // override tokenURI
    mapping(uint256 => string) private _tokenURIs;
    function _setTokenURI(uint256 tokenId, string memory uri) internal {
        _tokenURIs[tokenId] = uri;
    }
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
