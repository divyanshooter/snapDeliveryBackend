const Router = require("express").Router();
const userCtrl = require("../controller/user");
const isAuth = require("../middleware/is-Auth");

Router.post("/create", (req, res) => {
  userCtrl
    .addUser(req.body)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.post("/login", (req, res) => {
  userCtrl
    .loginUser(req.body)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.get("/fetch", isAuth, (req, res) => {
  userCtrl
    .getUser(req.userId)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

Router.delete("/delete", isAuth, (req, res) => {
  userCtrl
    .deleteUser(req.userId)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

module.exports = Router;
