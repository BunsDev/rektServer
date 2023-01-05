const basePath = process.cwd();
const { startCreating, buildSetup, setConfigTodefault } = require(`./src/main`);
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const mongoSetup = require("./database/mongoSetup");
const resourceRouter = require("./database/getResource")
const { getResourceWithAddress } = require("./database/addResource")
const resourceModel = require("./database/resource")

const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/resource", resourceRouter);


app.get('/prompt', async (req, res) => {
  console.log("wtf", req.query.address)
  let dbres = await resourceModel.findOne({ address: req.query.address });
  console.log("found", dbres)
  setConfigTodefault()
  if (!dbres) {
    buildSetup();
    let currentGeneratedObj = await startCreating(req.query.value);
    console.log("resChatGpt", currentGeneratedObj)
    setConfigTodefault()
    res.json(currentGeneratedObj);
  } else {
    console.log("emoty return")
    setConfigTodefault()
    res.json(dbres)
  }
  setConfigTodefault()

});

app.get('/', (req, res) => {
  res.json({ Dheeraj: "Lets do it" });
});

app.listen(PORT, () => {
  console.log("Server listening on port 5000");

  mongoSetup()
});

// (() => {
//   // buildSetup();
//   startCreating('dsborde.eth');
// })();
