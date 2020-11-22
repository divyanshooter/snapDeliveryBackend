const Router = require("express").Router();
const user = require("./user");
const restaurant = require("./restaurant");
const menu = require("./menu");

Router.use("/user", user);
Router.use("/restaurant", restaurant);
Router.use("/menu", menu);

module.exports = Router;
