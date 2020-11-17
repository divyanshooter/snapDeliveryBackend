const Router = require("express").Router();
const userCtrl = require("../controller/user");

Router.post("/create", (req, res) => {
  userCtrl
    .addUser(req.body)
    .then((response) => res.status(response.status).json(response.result))
    .catch((err) => res.status(err.status).json(err.result));
});

module.exports = Router;
