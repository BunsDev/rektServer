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
    try {
        let dbres = await resourceModel.findOne({ tokenId: req.params.tokenId });
        // Item created succesfuly
        console.log("ok", dbres)
        if (dbres) {
            if (dbres.isMinted) {
                res.status(201).send({ result: dbres.metadataJson + ".json" });
            }

        }
    } catch (error) {
        buildSetup();
        setConfigTodefault();
        let address = "to_be_defined";
        await createPfpForTokenId(address, req.query.tokenId);

        let dbres = await resourceModel.findOne({ tokenId: req.query.tokenId });
        if (dbres) {
            if (dbres.isMinted) {
                res.status(201).send({ result: dbres.metadataJson + ".json" });
            }
        }

    }
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
        res.status(500).send({ msg: "Address not whitelisted" });
    }
}


router.get("/check-whitelist", checkWhitelistingForAddress);
router.get("/get-data", getResourceWithAddress);
router.post("/update-mint", updateMintBoolDB)
router.get("/get-metadata", getMetadataJsonWithId);

module.exports = router;
