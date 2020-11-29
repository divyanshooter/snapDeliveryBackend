const Router = require("express").Router();
const user = require("./user");
const restaurant = require("./restaurant");
const menu = require("./menu");
const order = require("./order");

Router.use("/user", user);
Router.use("/restaurant", restaurant);
Router.use("/menu", menu);
Router.use("/order", order);

module.exports = Router;
