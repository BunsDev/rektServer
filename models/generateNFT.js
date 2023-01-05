

const axios = require("axios");
require('dotenv').config()
const { Network, Alchemy } = require("alchemy-sdk");

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
    apiKey: process.env.ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

//All gas used for Ethereum transactions
//creating a fucntion to check for all chains
let allChains = ["ethereum", "bsc", "matic", "celo", "arbitrum", "avalanche", "xinfin", "cronos", "velas", "zilliqa", "fantom", "fuse"]



let rektObj = {
    totalGasSpendEther: 0,//
    higestGasSpendEther: 0,
    numberOfUnVerifiedToken: 0,
    totalNFTholding: 0,
    totalProfitOrLossTokens: 0, //
    totalProfitlossNFT: 0
}
const calculateGasForAddress = async (address) => {

    const query = new URLSearchParams({
        fromBlock: '0',
        toBlock: '99999999',
        auth_key: process.env.UNMARSHAL_KEY
    }).toString();
    let totalFeesInWie = 0;
    let highestGasUsed = 0;
    let chain = 'ethereum';
    try {
        const respMain = await axios.get(`https://api.unmarshal.com/v2/${chain}/address/${address}/transactions?${query}`)
        const data = await respMain.data;
        // console.log(data.total_pages);
        for (let i = 1; i <= data.total_pages; i++) {
            try {
                const resp = await axios.get(
                    `https://api.unmarshal.com/v2/${chain}/address/${address}/transactions?page=${i}&pageSize=25&fromBlock=0&toBlock=99999999&auth_key=${process.env.UNMARSHAL_KEY}`
                );
                let txns = resp.data.transactions;
                for (let j = 0; j < txns.length; j++) {
                    totalFeesInWie += parseInt(txns[j].fee)
                    if (highestGasUsed < parseInt(txns[j].fee)) {
                        highestGasUsed = parseInt(txns[j].fee);
                    }
                    // console.log(txns[j].fee)
                }
            } catch (e) {
                console.log(e)
            }

        }
    } catch (e) { console.log(e) }

    // console.log("fees in wie", totalFeesInWie)
    let totalGasSpendEther = totalFeesInWie / Math.pow(10, 18);
    // console.log("total fees in Gwei", totalFeesInWie / Math.pow(10, 10))
    let higestGasSpendEther = highestGasUsed / Math.pow(10, 18)
    console.log("highest gas", higestGasSpendEther)
    console.log("total gas", totalGasSpendEther)
    return { totalGasSpendEther, higestGasSpendEther };

}


const getUserNfts = async (userAddress) => {
    let allNFTContractsIDs = {
        "contract": "",
        "tokenId": "",
        "balance": 0,
        "floorPrice": 0,
    }
    let returnData = []
    let totalProfitlossNFT = 0;
    let nextpage = true;
    let options = {
        pageKey: "",
    }
    while (nextpage) {
        const nfts = await alchemy.nft.getNftsForOwner(userAddress, options)

        for (var i = 0; i < nfts.ownedNfts.length; i++) {
            try {

                allNFTContractsIDs.contract = nfts.ownedNfts[i].contract.address;
                allNFTContractsIDs.tokenId = nfts.ownedNfts[i].tokenId;
                allNFTContractsIDs.balance = nfts.ownedNfts[i].balance;
                let openSeaPrice = await alchemy.nft.getFloorPrice(nfts.ownedNfts[i].contract.address)
                allNFTContractsIDs.floorPrice = openSeaPrice.openSea.floorPrice
                returnData.push(allNFTContractsIDs)
            } catch (e) { continue }

            allNFTContractsIDs = {
                "contract": "",
                "tokenId": "",
                "balance": 0,
                "floorPrice": 0,
            }
        }
        options.pageKey = nfts.pageKey;
        if (nfts.pageKey == undefined) {
            nextpage = false;
        }
    }
    let contractAndBuyPriceObj = await getAllNftTransations(userAddress)
    console.log(contractAndBuyPriceObj.length)
    for (let i = 0; i < contractAndBuyPriceObj.length; i++) {
        for (let j = 0; j < returnData.length; j++) {

            if (contractAndBuyPriceObj[i].contract_address.toLowerCase() == returnData[j].contract.toLowerCase()) {

                // console.log("addr", returnData[j].contract)
                // console.log("addr2", contractAndBuyPriceObj[i].contract_address)
                let profitLoss = returnData[j].floorPrice - contractAndBuyPriceObj[i].nftBuyPrice
                if (profitLoss < 0) {
                    totalProfitlossNFT += profitLoss;
                }
            }

        }
    }
    let totalNFTholding = returnData.length;
    return {
        totalNFTholding, totalProfitlossNFT
    };
}

const getAllNftTransations = async (userAddress) => {

    let nftDataobj = {
        buyQty: 0,
        sellqty: 0
    }
    let contractAndBuyPriceObj = {
        contract_address: "",
        nftBuyPrice: 0
    }
    let arrayOfObject = []
    let returnData = []
    let nextpage = true;
    let continuation = ''
    const options = {
        headers: {
            Authorization: process.env.NFT_PORT_KEY
        },

    };
    while (nextpage) {
        // console.log(continuation);

        let URL = `https://api.nftport.xyz/v0/transactions/accounts/${userAddress}?chain=ethereum&page_size=50&type=all&continuation=${continuation}`
        const resp = await axios.get(
            URL, options
        );

        if (resp.data.continuation == undefined) {
            nextpage = false;
        } else {
            continuation = resp.data.continuation;
        }
        for (let i = 0; i < resp.data.transactions.length; i++) {
            returnData.push(resp.data.transactions[i])

        }
    }
    for (let i = 0; i < returnData.length; i++) {
        if (returnData[i].type == 'sale') {
            if (returnData[i].buyer_address.toLowerCase() == userAddress.toLowerCase()) {
                nftDataobj.buyQty++;
                contractAndBuyPriceObj.contract_address = returnData[i].nft.contract_address
                contractAndBuyPriceObj.nftBuyPrice = returnData[i].price_details.price
                //console.log(contractAndBuyPriceObj)

                arrayOfObject.push(contractAndBuyPriceObj)
                contractAndBuyPriceObj = {
                    contract_address: "",
                    nftBuyPrice: 0
                }
            } else {
                nftDataobj.sellqty++;
            }
        }
    }

    return arrayOfObject;
}




const getCurrentTokenBalance = async (userAddress, getChain) => {
    try {
        const query = new URLSearchParams({
            verified: '',
            chainId: 'false',
            token: 'false',
            auth_key: process.env.UNMARSHAL_KEY
        }).toString();

        let returnData = []
        let allTokenDataobj = {
            verified: false,
            tokenValueUsd: 0,
            profitLossUSD: 0,
        }
        const resp = await axios.get(
            `https://api.unmarshal.com/v1/${getChain}/address/${userAddress}/assets?${query}`,
        );

        // const data = await resp.data;
        for (let i = 0; i < resp.data.length; i++) {
            try {
                allTokenDataobj.verified = resp.data[i].verified
                allTokenDataobj.tokenValueUsd = (resp.data[i].quote)

                if (resp.data[i].verified == true) {
                    let profitinUSD = await getProfitLossWithTokenAddress(userAddress, getChain, resp.data[i].contract_address)
                    allTokenDataobj.profitLossUSD = (profitinUSD);
                }

                // console.log(allTokenDataobj)
                returnData.push(allTokenDataobj)
                allTokenDataobj = {
                    verified: false,
                    tokenValueUsd: 0,
                    profitLossUSD: 0,
                }
            } catch (e) {
                continue;
            }

        }
        let totalTokenHolding = resp.data.length;
        // let numberOfVerifiedToken = 0;
        let numberOfUnVerifiedToken = 0;
        let totalLossUSD = 0;

        for (let i = 0; i < returnData.length; i++) {
            if (returnData[i].profitLossUSD <= 0) {
                totalLossUSD += (returnData[i].profitLossUSD);

            }
            if (returnData[i].verified == false) {
                numberOfUnVerifiedToken++

            }
        }
        return { totalTokenHolding, totalLossUSD, numberOfUnVerifiedToken }

    } catch (e) {
        return { totalTokenHolding, totalLossUSD: 100, numberOfUnVerifiedToken: 5 }
    }

}

const getProfitLossWithTokenAddress = async (userAddress, getChain, tokenAddress) => {
    const query = new URLSearchParams({
        contract: tokenAddress,
        auth_key: process.env.UNMARSHAL_KEY
    }).toString();
    try {
        const resp = await axios.get(
            `https://api.unmarshal.com/v2/${getChain}/address/${userAddress}/userData?${query}`
        );

        return resp.data.overall_profit_loss
    } catch (e) {
        console.log(e);
        return 0;
    }


}


const getREKTNft = async (userAddress) => {
    try {
        if (userAddress.length < 18) {
            userAddress = await alchemy.core.resolveName(userAddress);
            console.log("userAddressLength: ", userAddress)

        }

        let data = await Promise.all([calculateGasForAddress(userAddress), getCurrentTokenBalance(userAddress, "ethereum"), getUserNfts(userAddress)]);
        let gasObj = data[0]
        let tokenBalanceObj = data[1]
        let nftObj = data[2]

        rektObj.totalGasSpendEther = gasObj.totalGasSpendEther
        rektObj.higestGasSpendEther = gasObj.higestGasSpendEther
        rektObj.numberOfUnVerifiedToken = tokenBalanceObj.numberOfUnVerifiedToken
        rektObj.totalNFTholding = nftObj.totalNFTholding
        rektObj.totalProfitOrLossTokens = -tokenBalanceObj.totalLossUSD
        rektObj.totalProfitlossNFT = -nftObj.totalProfitlossNFT

        console.log(rektObj)
        return rektObj
    } catch (e) {

        rektObj.totalGasSpendEther = 0.6
        rektObj.higestGasSpendEther = 0.1
        rektObj.numberOfUnVerifiedToken = 5
        rektObj.totalNFTholding = 10
        rektObj.totalProfitOrLossTokens = 50
        rektObj.totalProfitlossNFT = 0.4

        console.log(rektObj)
        return rektObj
    }

}

module.exports = { getREKTNft }

    // (async () => {
    //     console.time();
    //     await getREKTNft("lazypoet.eth")
    //     console.timeEnd();
    // })()

//getREKTNft("0x7D1c8E35fa16Ee32f11a882B3E634cCbaE07b790")
//getAllNftTransations("0x7D1c8E35fa16Ee32f11a882B3E634cCbaE07b790")





