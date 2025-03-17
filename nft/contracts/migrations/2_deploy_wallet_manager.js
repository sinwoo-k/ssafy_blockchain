const WalletManager = artifacts.require("WalletManager");

module.exports = async function (deployer) {
  await deployer.deploy(WalletManager);
  console.log("WalletManager deployed at address:", WalletManager.address);
};
