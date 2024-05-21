const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyparser = require("body-parser");
const passport = require("passport");
const serverless = require("serverless-http");
const session = require("express-session");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use(bodyparser.urlencoded({ extended: true }));

app.use(session({
  secret: 'payment',
  resave: false,
  saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())

const PORT = process.env.PORT || 2005;
require("./google/auth");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Db conneted succesfully");
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