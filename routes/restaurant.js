const Router = require("express").Router();
const restaurantCtrl = require("../controller/restaurant");
const isAuth = require("../middleware/is-Auth");

Router.post("/create", (req, res) => {
  restaurantCtrl
    .addrestaurant(req.body)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.post("/login", (req, res) => {
  restaurantCtrl
    .loginrestaurant(req.body)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.get("/fetch", isAuth, (req, res) => {
  const menu = req.query.menu;
  restaurantCtrl
    .getRestaurant(req.restaurantId, menu)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.get("/fetchAll", isAuth, (req, res) => {
  const city = req.query.city;
  restaurantCtrl
    .getRestaurants(city)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.delete("/delete", isAuth, (req, res) => {
  restaurantCtrl
    .deleteRestaurant(req.restaurantId)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

module.exports = Router;
