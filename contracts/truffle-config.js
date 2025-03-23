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
        //`https://multi-holy-season.ethereum-holesky.quiknode.pro/09723c9af9caab038b9ca7e4ac263a1382753ca2/` // Holesky QuikNode RPC 엔드포인트
        `https://ethereum-holesky-rpc.publicnode.com` // Holesky publicnode RPC 엔드포인트
        //`https://holesky.infura.io/v3/${process.env.INFURA_PROJECT_ID}` // Holesky Infura RPC 엔드포인트
      ),
      network_id: 17000, // Holesky 네트워크 ID
      gas: 6000000,            // 낮은 가스 한도로 변경
      gasPrice: 10000000000, // 가스 가격 (10 Gwei = 10,000,000,000 wei)
      timeoutBlocks: 500,    // 블록 타임아웃 증가
      skipDryRun: true,    // dry run 생략 (배포 속도 향상)
      networkCheckTimeout: 1000000, // 5분 (단위: ms)
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17",      // Fetch exact version from solc-bin (default: truffle's version)
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    }
  },
};
