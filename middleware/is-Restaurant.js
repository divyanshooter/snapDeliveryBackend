const restaurantModel = require("../models/restaurant");
const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  if (!req.restaurantId) {
    res.send({ status: 401, message: "Not Authenticated" });
    return;
  }

  restaurantModel
    .findOne({ _id: mongoose.Types.ObjectId(req.restaurantId) })
    .then((restaurant) => {
      if (!restaurant) {
        res.status(404).json({ result: { error: "Not Found" } });
        return;
      }
      if (restaurant.menuId) {
        req.menuId = restaurant.menuId;
        next();
      } else {
        res.status(404).json({ result: { error: "Not Found" } });
        return;
      }
    })
    .catch((err) =>
      res.status(500).json({ result: { error: "Server Error" } })
    );
};
