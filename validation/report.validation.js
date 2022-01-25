const { body, validationResult } = require("express-validator");

module.exports = {
  reportValidation: [
    body("status").not().isEmpty(),
    body("availability").not().isEmpty(),
    body("responsetime").not().isEmpty(),
    body("uptime").not().isEmpty(),
    body("downtime").not().isEmpty(),
    body("history").not().isEmpty(),
    body("outages").not().isEmpty(),
    body("url").not().isEmpty(),
  ],
  catchValidationErrors: (req, res, next) => {
    const errorsObj = validationResult(req);
    if (errorsObj.errors.length) {
      res
        .status(400)
        .json({ message: "Invalid Info!", data: errorsObj.errors });
    } else {
      next();
    }
  },
};
