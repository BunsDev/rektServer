const basePath = process.cwd();
const { startCreating, buildSetup, setConfigTodefault } = require(`${basePath}/src/main.js`);
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const mongodb = require(`${basePath}/dataBase/mongoSetup`);
const resourceRouter = require(`${basePath}/database/getResource`)
const { getResourceWithAddress } = require(`${basePath}/database/addResource`)
const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use("/resource", resourceRouter);


app.get('/prompt', async (req, res) => {
  console.log("wtf", req.query.value)
  let currentGeneratedObj = await startCreating(req.query.value);
  console.log("resChatGpt", currentGeneratedObj)
  setConfigTodefault()
  res.json(currentGeneratedObj);
});

app.get('/', (req, res) => {
  res.json({ Dheeraj: "Lets do it" });
});

app.listen(PORT, () => {
  console.log("Server listening on port 5000");

  mongodb()
});

// (() => {
//   // buildSetup();
//   startCreating('dsborde.eth');
// })();
