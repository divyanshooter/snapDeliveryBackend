const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const routes = require("./routes/routes");
const { exit } = require("process");

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.5q7vj.mongodb.net/${process.env.MONGO_DB}`;
const app = express();

const accessStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessStream }));
app.use(bodyParser.urlencoded({ extended: false }));
require("dotenv").config();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.get("/", (req, res) =>
  res.send({ message: "Working,Welcome To SnapDelivery" })
);

app.use("/app/", routes);

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected");
    app.listen(process.env.PORT || 4000);
  })
  .catch((err) => console.log(err));

function stop() {
  exit();
}
module.exports = app;
module.exports.stop = stop;
