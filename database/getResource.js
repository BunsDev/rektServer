var express = require("express");
var router = express.Router();
const resourceModel = require("./resource")

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
        let dbres = await resourceModel.findOne({ address: req.params.address });
        // Item created succesfuly
        console.log("ok", dbres)
        if (dbres) {
            dbres.isMinted = req.params.isMinted;
            dbres.tokenId = req.params.tokenId;
            res.status(201).send({ result: dbres });
        }
    } catch (error) {
        console.log(error);
        // Unable to save to DB
        res.status(500).send({ msg: "Internal server error" });
    }
}

const getMetadataJson = async (req, res) => {
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
        console.log(error);
        // Unable to save to DB
        res.status(500).send({ msg: "Token ID not yet Minted" });
    }
}





// router.post("/add-data", addResource);
// router.post("/update-data", updateResource);
router.get("/get-data", getResourceWithAddress);
router.post("/update-mint", updateMintBoolDB)
router.get("/get-metadata", getMetadataJson);
module.exports = router;
