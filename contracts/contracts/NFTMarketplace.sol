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
        uint256 price; // 원래 가격
        uint256 amount; // 판매 금액 (여기서 기록)
        bool isListed;
    }

    // 로열티 관련 구조체 정의 (원작자, 등록자, 관리자 지갑)
    struct RoyaltyInfo {
        address originalCreator;
        address ownerShare;
        address adminWallet;
    }
    // Purchase 정보를 저장할 구조체 정의
    struct PurchaseRecord {
        address buyer;
        uint256 price;
        uint256 purchaseTime;
    }

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => RoyaltyInfo) public royaltyInfoByToken;
    mapping(uint256 => PurchaseRecord) public purchaseRecords;

    // 이벤트 정의
    event Minted(address indexed to, uint256 tokenId, string tokenURI);
    event NFTListed(uint256 tokenId, address seller, uint256 price);
    event NFTSold(uint256 tokenId, address buyer, uint256 price);

    constructor() ERC721("Chaintoon", "Chaintoon") {}

    /**
     * @dev NFT를 민팅하는 함수 (소유자만 호출 가능).
     * @param to 민팅된 NFT의 소유자 주소
     * @param _tokenURI NFT 메타데이터 URI
     * @param originalCreator 원작자 지갑 주소
     * @param ownerShare 소유자자 지갑 주소
     * @param adminWallet 관리자 지갑 주소
     * @return newTokenId 발행된 NFT의 tokenId
     */
    function mint(
        address to,
        string memory _tokenURI,
        address originalCreator,
        address ownerShare,
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
            ownerShare: ownerShare,
            adminWallet: adminWallet
        });

        emit Minted(to, newTokenId, _tokenURI);
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

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            amount: price, // 판매 금액을 amount에 기록
            isListed: true
        });
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
        Listing storage listing = listings[tokenId];
        require(listing.isListed, "NFT is not listed for sale");
        require(msg.value >= listing.price, "Insufficient funds");

        uint256 salePrice = msg.value;  // 실제 구매 금액 기준

        // 로열티·분배 정보
        RoyaltyInfo storage info = royaltyInfoByToken[tokenId];

        // 1) msg.value 기준으로 4%, 95% 계산
        uint256 originalCreatorShare = (salePrice * 4) / 100;
        uint256 ownerShare           = (salePrice * 95) / 100;

        // 2) 나머지 전액 → 관리자 몫
        uint256 adminShare = salePrice - (originalCreatorShare + ownerShare);

        // 3) 분배 (call 방식 + 성공 체크)
        (bool ok1,) = payable(info.originalCreator).call{value: originalCreatorShare}("");
        (bool ok2,) = payable(info.ownerShare).call{value: ownerShare}("");
        (bool ok3,) = payable(info.adminWallet).call{value: adminShare}("");
        require(ok1 && ok2 && ok3, "Transfer failed");

        // 4) NFT 소유권 이전
        _transfer(listing.seller, msg.sender, tokenId);
        listing.isListed = false;

        // 5) 다음 판매자를 위해 ownerShare 주소 업데이트
        info.ownerShare = msg.sender;

        // 6) 구매 기록 저장
        purchaseRecords[tokenId] = PurchaseRecord({
            buyer: msg.sender,
            price: salePrice,
            purchaseTime: block.timestamp
        });

        emit NFTSold(tokenId, msg.sender, salePrice);
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
