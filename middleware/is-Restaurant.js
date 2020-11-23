const restaurantModel = require("../models/restaurant");
module.exports = (req, res, next) => {
  if (!req.restaurantId) {
    res.send({ status: 401, message: "Not Authenticated" });
    return;
  }

  restaurantModel.find(req.restaurantId).then((restaurant) => {
    if (!restaurant) {
      res.status(404).json({ result: { error: "Not Found" } });
    }
    if (restaurant.menuId) {
      req.menuId;
    }
  });
  next();
};
