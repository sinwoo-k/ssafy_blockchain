// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTContract is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // 민팅 이벤트 정의
    event NFTMinted(address indexed to, uint256 tokenId, string tokenURI);

    constructor() ERC721("MyNFT", "MNFT") {}

    /**
     * @dev 소유자(owner)만 호출할 수 있는 민팅 함수.
     * to 주소로 토큰을 민팅하고, tokenURI를 설정합니다.
     * @param to 민팅된 NFT의 소유자 주소
     * @param tokenURI NFT 메타데이터 URI
     * @return newTokenId 발행된 NFT의 tokenId
     */
    function mint(address to, string memory tokenURI) public onlyOwner returns (uint256) {
        require(bytes(tokenURI).length > 0, "Token URI cannot be empty");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        emit NFTMinted(to, newTokenId, tokenURI);
        return newTokenId;
    }
}
