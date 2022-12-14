const { network, ethers } = require("hardhat")
const { developmentChains, DECIMALS, INITIAL_ANSWER } = require("../helper.hardhat.config")

const BASE_FEE = ethers.utils.parseEther("0.25")
const GAS_PRICE_LINK = 1e9 // 1000000000
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        // local network
        log("Local network detected! Deploying mocks..")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        log("VRFCoordinatorV2Mock DEPLOYED!")
        log("------------------------------------")
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        })
    }
}

module.exports.tags = ["all", "mocks"]
