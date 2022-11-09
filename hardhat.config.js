require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")
require("hardhat-contract-sizer")
require("@nomiclabs/hardhat-waffle")

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.17",
            },
            {
                version: "0.6.6",
            },
        ],
    },
    defaultNetwork: "hardhat",
    networks: {
        goreli: {
            url: process.env.GORELI_RPC_URL,
            accounts: [process.env.PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
        },
        localhost: {
            url: " http://127.0.0.1:8545/",
            // accounts: Hardhat Magic,
            chainId: 31337,
        },
        hardhat: {
            chainId: 31337,
            blockConfirmations: 6,
        },
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        // coinmarketcap: process.env.COIN_MARKET_API_KEY,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            // network
            //4:1
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        timeout: 600000, // 200 seconds max
    },
}
