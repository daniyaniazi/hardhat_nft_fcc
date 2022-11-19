const { network } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper.hardhat.config")
const { storeImages } = require("../utils/uploadToPinata")

const imagesLocation = "./nfts/random/"

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let tokenUris

    console.log(process.env.UPLOAD_TO_PINATA)
    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }

    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock
    if (developmentChains.includes(network.name)) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address

        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        subscriptionId = transactionReceipt.events[0].args.subId
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    log("---------------------")

    const arguments = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId]["gasLane"],
        networkConfig[chainId]["mintFee"],
        networkConfig[chainId]["callbackGasLimit"],
        tokenUris,
    ]

    async function handleTokenUris() {
        tokenUris = []
        const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
        console.log(imageUploadResponses)
        // for (imageUploadResponseIndex in imageUploadResponses) {
        //     let tokenUriMetadata = { ...metadataTemplate }
        //     tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
        //     tokenUriMetadata.description = `An adorable ${tokenUriMetadata.name} pup!`
        //     tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        //     console.log(`Uploading ${tokenUriMetadata.name}...`)
        //     const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        //     tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
        // }
        // console.log("Token URIs uploaded! They are:")
        // console.log(tokenUris)
        // return tokenUris
    }
}

module.exports.tags = ["all", "randomipfs", "main"]
