const Router = require("express").Router();
const user = require("./user");
const restaurant = require("./restaurant");

Router.use("/user", user);
Router.use("/restaurant", restaurant);

module.exports = Router;
