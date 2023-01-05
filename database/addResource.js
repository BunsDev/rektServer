var express = require("express");
var router = express.Router();
const resourceModel = require("./resource")

const addResource = async (object) => {
    let respDB = await resourceModel.findOne({ address: object.address });
    if (!respDB) {

        let resourceData = new resourceModel({
            address: object.address,
            pfp_links: object.pfp_link,
            metadata_links: object.metadata_link,
            minted: object.minted,
            tokenId: object.tokenId,
            metadataJson: object.metadataJson
        });

        try {
            let dbres = await resourceData.save();
            // Item created succesfuly
            if (dbres) {
                console.log("saved")
                // res.status(201).send({ result: resourceData });
            }
        } catch (error) {
            console.log(error);
            // Unable to save to DB
            // res.status(500).send({ msg: "Internal server error" });
        }
    } else {
        throw ("object already exists");
    }

}

const getResourceWithAddress = async (object) => {
    try {

        let dbres = await resourceModel.findOne({ address: object.address });
        // Item created succesfuly
        if (dbres) {
            return dbres
        } else {
            return 0
        }
    } catch (error) {
        console.log(error);
        // Unable to save to DB
        return 0
    }
}
module.exports = { addResource, getResourceWithAddress }
