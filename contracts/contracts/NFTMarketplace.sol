// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    // NFT 민팅 관련 변수
    uint256 private _tokenIds;

    // 판매 목록 구조체 정의
    struct Listing {
        address seller;
        uint256 price;
        bool isListed;
    }
    // 토큰 ID -> Listing (판매 정보)
    mapping(uint256 => Listing) public listings;

    // 로열티 관련 구조체 정의 (원작자, 등록자, 관리자 지갑)
    struct RoyaltyInfo {
        address originalCreator;
        address registrant;
        address adminWallet;
    }
    // 토큰 ID -> RoyaltyInfo (분배 주소 보관)
    mapping(uint256 => RoyaltyInfo) public royaltyInfoByToken;

    // 이벤트 정의
    event NFTMinted(address indexed to, uint256 tokenId, string tokenURI);
    event NFTListed(uint256 tokenId, address seller, uint256 price);
    event NFTSold(uint256 tokenId, address buyer, uint256 price);

    constructor() ERC721("Chaintoon", "Chaintoon") {}

    /**
     * @dev NFT를 민팅하는 함수 (소유자만 호출 가능).
     * @param to 민팅된 NFT의 소유자 주소
     * @param _tokenURI NFT 메타데이터 URI
     * @param originalCreator 원작자 지갑 주소
     * @param registrant 등록자 지갑 주소
     * @param adminWallet 관리자 지갑 주소
     * @return newTokenId 발행된 NFT의 tokenId
     */
    function mint(
        address to,
        string memory _tokenURI,
        address originalCreator,
        address registrant,
        address adminWallet
    ) public returns (uint256) {
        require(bytes(_tokenURI).length > 0, "Token URI cannot be empty");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        // 실제 NFT 민팅
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        // 로열티 정보 저장
        royaltyInfoByToken[newTokenId] = RoyaltyInfo({
            originalCreator: originalCreator,
            registrant: registrant,
            adminWallet: adminWallet
        });

        emit NFTMinted(to, newTokenId, _tokenURI);
        return newTokenId;
    }
    /**
     * @dev NFT를 판매 목록에 등록하는 함수.
     * @param tokenId 판매할 토큰 ID
     * @param price 판매 가격 (Wei 단위)
     */
    function listNFT(uint256 tokenId, uint256 price) public {
        require(price > 0, "Price must be greater than zero");
        // NFT의 소유자만 판매할 수 있도록 체크
        require(ownerOf(tokenId) == msg.sender, "Only owner can list NFT");

        listings[tokenId] = Listing(msg.sender, price, true);

        emit NFTListed(tokenId, msg.sender, price);
    }

    /**
     * @dev 특정 토큰이 판매 중인지 확인하는 함수.
     * @param tokenId 확인할 토큰 ID
     * @return bool 판매 여부
     */
    function isListed(uint256 tokenId) public view returns (bool) {
        return listings[tokenId].isListed;
    }

    /**
     * @dev NFT를 구매하는 함수 (가격 분배 예시 적용).
     * @param tokenId 구매할 토큰 ID
     */
    function buyNFT(uint256 tokenId) public payable {
        Listing memory listing = listings[tokenId];
        require(listing.isListed, "NFT is not listed for sale");
        require(msg.value >= listing.price, "Insufficient funds");

        // (1) 이 NFT의 로열티 정보 가져오기
        RoyaltyInfo memory info = royaltyInfoByToken[tokenId];

        // (2) 예: 4% / 95% / 1% 분배 계산
        uint256 originalCreatorShare = (listing.price * 4) / 100;
        uint256 registrantShare = (listing.price * 95) / 100;
        uint256 adminShare = (listing.price * 1) / 100;

        // (3) 각각 분배
        payable(info.originalCreator).transfer(originalCreatorShare);
        payable(info.registrant).transfer(registrantShare);
        payable(info.adminWallet).transfer(adminShare);

        // (4) NFT 소유권 이전
        _transfer(listing.seller, msg.sender, tokenId);
        listings[tokenId].isListed = false;

        // (5) 이벤트 발생
        emit NFTSold(tokenId, msg.sender, listing.price);
    }

    // 아래는 ERC721Enumerable 및 ERC721URIStorage를 함께 사용할 때 필수로 오버라이드 해야하는 함수들입니다.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
