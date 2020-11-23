const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (!req.get("Authorization")) {
    res.status(401).send({ status: 401, error: "Not Authenticated" });
    return;
  }
  const token = req.get("Authorization").split(" ")[1];

  let decodeToken;
  try {
    decodeToken = jwt.verify(token, process.env.JWT_KEY);
  } catch (err) {
    res.status(500).send({ status: 500, error: "Server Error" });
    return;
  }
  if (!decodeToken) {
    res.status(401).send({ status: 401, error: "Not Authenticated" });
    return;
  }

  if (decodeToken.userId) req.userId = decodeToken.userId;
  else req.restaurantId = decodeToken.restaurantId;

  next();
};
