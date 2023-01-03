var express = require("express");
var router = express.Router();
const resourceModel = require("./resource")

const getResourceWithAddress = async (req, res) => {
    try {
        console.log("dok", req.query.value)

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

// router.post("/add-data", addResource);
// router.post("/update-data", updateResource);
router.get("/get-data", getResourceWithAddress);

module.exports = router;
