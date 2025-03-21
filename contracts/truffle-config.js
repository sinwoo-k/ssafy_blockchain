require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "dist", "contracts"),

  networks: {
    development: {
      host: "127.0.0.1", // Ganache 실행 호스트
      port: 8545,        // Ganache 기본 포트
      network_id: "*"    // 모든 네트워크에 연결
    },
    holesky: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC,
        `wss://ethereum-holesky-rpc.publicnode.com` // Holesky publicnode RPC 엔드포인트
        // `https://holesky.infura.io/v3/${process.env.INFURA_PROJECT_ID}` // Holesky Infura RPC 엔드포인트
      ),
      network_id: 17000, // Holesky 네트워크 ID
      gas: 8000000,      // 가스 제한 (필요에 따라 조정)
      gasPrice: 20000000000, // 가스 가격 (20 Gwei)
      confirmations: 2,   // 트랜잭션 확인 횟수
      timeoutBlocks: 200, // 블록 타임아웃
      skipDryRun: true    // dry run 생략 (배포 속도 향상)
    },
    networkCheckTimeout: 180000, // 3분 (단위: ms)
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",      // Fetch exact version from solc-bin (default: truffle's version)

    }
  },
};
