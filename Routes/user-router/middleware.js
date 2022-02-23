const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

function createUserkValidation(req, res, next) {
  const userSchema = Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    verify: Joi.string().required().valid("Pending", "Active"),
  });
  const result = userSchema.validate(req.body);
  if (result.error) {
    res.status(400).json({ error: result.error.message });
  } else {
    next();
  }
}
function signinValidation(req, res, next) {
  const userSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.required(),
  });

  const result = userSchema.validate(req.body);
  if (result.error) {
    res.status(400).json({ error: result.error.message });
  } else {
    next();
  }
}
function otpValidation(req, res, next) {
  const result = Joi.object()
    .keys({
      OTP: Joi.number().min(5).max(5).required(),
    })
    .validate(req.params);
  if (result.error) {
    res.status(400).json({ error: result.error.message });
  } else {
    next();
  }
}
function reqParamsValidation(req, res, next) {
  const result = Joi.object()
    .keys({
      id: Joi.string().alphanum().min(24).max(24),
    })
    .validate(req.params);
  if (result.error) {
    res.status(400).json({ error: result.error.message });
  } else {
    next();
  }
}

const userAuthentication = (req, res, next) => {
  let token = req.cookies["Token"];
  if (token) {
    let authorizied = jwt.verify(token, config.get("secret"));
    if (!authorizied) {
      res.status(401).json({ message: "User not authorizied" });
    } else {
      next();
    }
  } else {
    res.status(401).json({ message: "User not authorizied" });
  }
};
module.exports = {
  createUserkValidation,
  signinValidation,
  reqParamsValidation,
  otpValidation,
  userAuthentication,
};
