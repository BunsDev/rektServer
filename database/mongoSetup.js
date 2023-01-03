const mongoose = require("mongoose")
const mongoSetup = () => {
    mongoose.connect(
        process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    ).then(() => {
        //runScript();
        console.log(`MONGO DB connected succesfully`)
    }
    ).catch((err) => {
        console.log(`MONGO DB connection failed`);
        console.log(err);
        process.exit(1);
    })

}

module.exports = mongoSetup;