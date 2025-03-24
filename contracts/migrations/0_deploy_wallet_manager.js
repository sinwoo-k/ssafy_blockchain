const WalletManager = artifacts.require("WalletManager");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(WalletManager);
  const instance = await WalletManager.deployed();
  console.log("WalletManager deployed at address:", instance.address);
};
