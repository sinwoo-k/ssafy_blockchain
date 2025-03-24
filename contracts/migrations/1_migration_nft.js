const NFTMarketplace = artifacts.require("NFTMarketplace");

module.exports = async function (deployer) {
    await deployer.deploy(NFTMarketplace);
    const instance = await NFTMarketplace.deployed();
    console.log("NFTMarketplace deployed at address:", instance.address);
};
