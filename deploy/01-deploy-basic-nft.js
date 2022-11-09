const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper.hardhat.config")
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("-------------------------------")
    const args = []
    const basicNft = await deploy("BasicNFT", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmation: network.config.blockConfirmations || 1,
    })
    log("-------------------------------")
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(basicNft.address, args)
    }
    log("-------------------------------")
}

module.exports.tags = ["all", "basicnft", "main"]
