const NFTContract = artifacts.require("NFTContract");

module.exports = async function (deployer) {
  await deployer.deploy(NFTContract);
  const instance = await NFTContract.deployed();
  console.log("NFTContract deployed at address:", instance.address);
};
