const Router = require("express").Router();
const menuCtrl = require("../controller/menu");
const isAuth = require("../middleware/is-Auth");
const isRestaurant = require("../middleware/is-Restaurant");

Router.post("/create", isAuth, isRestaurant, (req, res) => {
  menuCtrl
    .addmenu(req.body)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.put("/update", isAuth, isRestaurant, (req, res) => {
  menuCtrl
    .updateMenu(req.body)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.get("/fetch", isAuth, (req, res) => {
  menuCtrl
    .getMenu(req.menuId)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.delete("/delete", isAuth, isRestaurant, (req, res) => {
  menuCtrl
    .deleteMenu(req.menuId)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

module.exports = Router;
