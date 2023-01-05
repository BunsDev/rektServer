var express = require("express");
var router = express.Router();
const resourceModel = require("./resource")
const { createPfpForTokenId, buildSetup, setConfigTodefault } = require(`../src/main`);
const { getProofForAddress } = require("../whitelist/getMerkleRoot")
const getResourceWithAddress = async (req, res) => {
    try {

        let dbres = await resourceModel.findOne({ address: req.query.value });
        // Item created succesfuly
        console.log("ok", dbres)
        if (dbres) {
            res.status(201).send({ result: dbres });
        }
    } catch (error) {
        console.log(error);
        // Unable to save to DB
        res.status(500).send({ msg: "Internal server error" });
    }
}

const updateMintBoolDB = async (req, res) => {
    try {
        let dbres = await resourceModel.findOne({ address: req.query.address });
        // Item created succesfuly
        console.log("ok", dbres)
        if (dbres) {
            dbres.isMinted = req.body.isMinted;
            dbres.tokenId = req.body.tokenId;
            res.status(201).send({ result: dbres });
        }
    } catch (error) {
        console.log(error);
        // Unable to save to DB
        res.status(500).send({ msg: "Internal server error" });
    }
}

const getMetadataJsonWithId = async (req, res) => {
    console.log("Getting metadata", typeof (req.params.tokenId))
    let id = parseInt(req.params.tokenId.split(".")[0])
    console.log("Getting id", id)
    try {

        let dbres = await resourceModel.findOne({ tokenId: id });
        // Item created succesfuly
        console.log("ok", dbres)
        if (dbres) {
            if (dbres.isMinted) {
                res.status(200).send(dbres.metadataJson);
            }

        } else {
            buildSetup();
            setConfigTodefault();
            console.log("id", id)
            let address = "#" + id;
            console.log("address", address)
            await createPfpForTokenId(address, id);

            let dbres = await resourceModel.findOne({ tokenId: id });
            if (dbres) {
                if (dbres.isMinted) {
                    res.status(200).send(dbres.metadataJson);
                }
            }

        }
    } catch (e) { console.log(e) }
}


const checkWhitelistingForAddress = async (req, res) => {
    try {
        let merkleProofs = await getProofForAddress(req.query.address);
        if (merkleProofs.length > 0) {
            res.status(201).send({ result: merkleProofs });
        }
    } catch (e) {
        console.log(error);
        // Unable to save to DB
        res.status(400).send({ msg: "Address not whitelisted" });
    }
}


router.get("/check-whitelist", checkWhitelistingForAddress);
router.get("/get-data", getResourceWithAddress);
router.post("/update-mint", updateMintBoolDB)
router.get("/get-metadata/:tokenId", getMetadataJsonWithId);

module.exports = router;
