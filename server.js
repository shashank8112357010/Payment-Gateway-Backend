const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyparser = require("body-parser");
const serverless = require("serverless-http");
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 2005;

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Db conneted succesfully", process.env.DB_URL);
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.status(200).send({ msg: "Working App" });
});

require("./routes/auth.route")(app);
require("./routes/adminAuth.route")(app);
require("./routes/static.route")(app);
require("./routes/userAuth.route")(app);




app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
module.exports = app;
module.exports.handler = serverless(app);