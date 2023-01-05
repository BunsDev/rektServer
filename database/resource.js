const mongoose = require('mongoose')
const Schema = mongoose.Schema;


let resourceSchema = new Schema({

    address: { type: String, required: true },
    pfp_links: { type: String, required: true },
    metadata_links: { type: String, required: true },
    isMinted: { type: Boolean, required: true },
    tokenId: { type: Number },
    metadataJson: { type: String }

}, { timestamps: true })


const resource = mongoose.model("resource", resourceSchema);
module.exports = resource;