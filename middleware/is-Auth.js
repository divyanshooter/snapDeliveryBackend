const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (!req.get("Authorization")) {
    res.send({ status: 401, message: "Not Authenticated" });
    return;
  }
  const token = req.get("Authorization").split(" ")[1];

  let decodeToken;
  try {
    decodeToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    res.send({ status: 500 });
    return;
  }
  if (!decodeToken) {
    res.send({ status: 401, message: "Not Authenticated" });
    return;
  }

  if (req.userId) req.userId = decodeToken.userId;
  else req.restaurantId = decodeToken.restaurantId;

  next();
};
