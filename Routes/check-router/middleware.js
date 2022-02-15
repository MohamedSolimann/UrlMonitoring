const Joi = require("joi");

const checkSchema = Joi.object().keys({
  user_id: Joi.string().required(),
  checkname: Joi.string().required(),
  url: Joi.string().required(),
  protocol: Joi.string().required(),
  path: Joi.string().optional(),
  port: Joi.number().optional(),
  tag: Joi.string().optional(),
  webhook: Joi.string().optional(),
  timeout: Joi.number().optional(),
  interval: Joi.number().optional(),
  status: Joi.string().required().valid("Paused", "Active"),
});

function createCheckValidation(req, res, next) {
  const result = checkSchema.validate(req.body);
  if (result.error) {
    res.status(400).json({ error: result.error.message });
  } else {
    next();
  }
}
function reqParamsValidation(req, res, next) {
  const result = Joi.object()
    .keys({
      id: Joi.string().min(24).max(24).alphanum(),
    })
    .validate(req.params);
  if (result.error) {
    res.status(400).json({ error: result.error.message });
  } else {
    next();
  }
}
module.exports = { createCheckValidation, reqParamsValidation };
