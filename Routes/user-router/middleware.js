const Joi = require("joi");

const userSchema = Joi.object().keys({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  verify: Joi.string().required().valid("Pending", "Active"),
});

function createUserkValidation(req, res, next) {
  const result = userSchema.validate(req.body);
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
module.exports = { createUserkValidation, reqParamsValidation };
