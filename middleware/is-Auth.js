const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];

  let decodeToken;
  try {
    decodeToken = jwt.verify(token, "secretkeysupersecretkey");
  } catch (err) {
    res.send({ status: 500 });
  }
  if (!decodeToken) {
    res.send({ status: 401, message: "Not Authenticated" });
  }
  req.userId = decodeToken.userId;
  next();
};
