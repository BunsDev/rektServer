require("dotenv").config();
const lighthouse = require('@lighthouse-web3/sdk');
const getLightHouseHash = async (localPath) => {
    // const path = "/Users/arken/projects/rekt/hashlips_art_engine-1.1.2_patch_v6/build/images/1.png"; //Give path to the file 
    const path = localPath
    const apiKey = process.env.LIGHTHOUSE_API_KEY; //generate from https://files.lighthouse.storage/ or cli (lighthouse-web3 api-key --new)

    const response = await lighthouse.upload(path, apiKey);

    // Display response
    console.log(response);
    // let URL = "https://ipfs.io/ipfs/" + response.data.Hash;
    let URL = "https://gateway.lighthouse.storage/ipfs/" + response.data.Hash;
    // console.log("Visit at: ", URL);

    return URL
}

module.exports = { getLightHouseHash }