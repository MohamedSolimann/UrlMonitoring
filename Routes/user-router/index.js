const config = require("config");
const jwt = require("jsonwebtoken");
const userAuthentication = (req, res, next) => {
  let token = req.cookies["Token"];
  let authorizied = jwt.verify(token, config.get("secret"));
  if (!authorizied) {
    res.status(401).json({ message: "User not authorizied" });
  } else {
    next();
  }
};
module.exports = { userAuthentication };
