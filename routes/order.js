const Router = require("express").Router();
const orderCtrl = require("../controller/order");
const isAuth = require("../middleware/is-Auth");

Router.post("/create", isAuth, (req, res) => {
  orderCtrl
    .addOrder(req.userId, req.body)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.put("/update", isAuth, (req, res) => {
  orderCtrl
    .updateOrder(req.restaurantId, req.body)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.get("/fetch", isAuth, (req, res) => {
  const id = req.query.id;
  orderCtrl
    .getOrder(id)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.get("/fetchAll", isAuth, (req, res) => {
  orderCtrl
    .getOrders(req.userId, req.restaurantId)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

module.exports = Router;
