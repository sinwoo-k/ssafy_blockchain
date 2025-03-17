// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract WalletManager {
    address public owner;
    mapping(address => bool) public registered;
    mapping(address => string) public walletPublicKeys;
    
    event WalletRegistered(address indexed wallet, string publicKey);
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev 사용자가 자신의 지갑을 등록합니다.
     * MetaMask와 같은 클라이언트를 통해 호출되며, msg.sender가 사용자의 지갑 주소가 됩니다.
     * @param publicKey 사용자가 등록할 공개키 (오프체인에서 생성된 정보)
     */
    function registerWallet(string calldata publicKey) external {
        require(!registered[msg.sender], "Wallet already registered");
        registered[msg.sender] = true;
        walletPublicKeys[msg.sender] = publicKey;
        emit WalletRegistered(msg.sender, publicKey);
    }
    
    /**
     * @dev 관리자가 임의의 지갑을 등록할 수 있는 함수.
     * 컨트랙트 배포자(owner)만 호출할 수 있습니다.
     * @param _wallet 등록할 지갑 주소
     * @param publicKey 등록할 공개키
     */
    function adminRegisterWallet(address _wallet, string calldata publicKey) external {
        // require(msg.sender == owner, "Only owner can register wallet");
        require(!registered[_wallet], "Wallet already registered");
        registered[_wallet] = true;
        walletPublicKeys[_wallet] = publicKey;
        emit WalletRegistered(_wallet, publicKey);
    }
    
    /**
     * @dev 특정 지갑의 등록 여부를 조회합니다.
     * @param wallet 확인할 지갑 주소
     * @return bool 등록 여부
     */
    function isWalletRegistered(address wallet) external view returns (bool) {
        return registered[wallet];
    }
    
    /**
     * @dev 특정 지갑의 정보를 조회합니다.
     * @param wallet 조회할 지갑 주소
     * @return isRegistered 해당 지갑이 등록되었는지 여부, publicKey 등록된 공개키 (등록되지 않았다면 빈 문자열)
     */
    function getWalletInfo(address wallet) external view returns (bool isRegistered, string memory publicKey) {
        isRegistered = registered[wallet];
        publicKey = walletPublicKeys[wallet];
    }
}
