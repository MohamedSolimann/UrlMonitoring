const userAuthentication = (req, res, next) => {
  let token = req.cookies["Token"];
  if (!token) {
    res.status(401).json({ message: "User not authorizied" });
  } else {
    next();
  }
};
module.exports = { userAuthentication };
