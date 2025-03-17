
const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "..", "dist", "contracts"),

  networks: {
    development: {
      host: "127.0.0.1", // Ganache 실행 호스트
      port: 8545,        // Ganache 기본 포트
      network_id: "*"    // 모든 네트워크에 연결
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.9",      // Fetch exact version from solc-bin (default: truffle's version)

    }
  },
};
