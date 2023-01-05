const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let metadataSchema = new Schema({

    "name": { type: String },
    "description": { type: String },
    "image": { type: String },
    "dna": { type: String },
    "edition": { type: Number },
    "date": { type: Date },
    "attributes": [
        {
            "trait_type": { type: String },
            "value": { type: String }
        },
        {
            "trait_type": { type: String },
            "value": { type: String }
        },
        {
            "trait_type": { type: String },
            "value": { type: String }
        },
        {
            "trait_type": { type: String },
            "value": { type: String }
        },
        {
            "trait_type": { type: String },
            "value": { type: String }
        },
        {
            "trait_type": { type: String },
            "value": { type: String }
        }
    ],
    "compiler": { type: String }

}, { timestamps: true })

let resourceSchema = new Schema({

    address: { type: String, required: true },
    pfp_link: { type: String, required: true },
    metadata_link: { type: String, required: true },
    isMinted: { type: Boolean, required: true },
    tokenId: { type: Number },
    metadataJson: { type: metadataSchema }

}, { timestamps: true })


const resource = mongoose.model("resource", resourceSchema);
module.exports = resource;