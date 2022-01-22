const { body, validationResult } = require("express-validator");

module.exports = {
  checkCreation: [
    body("checkname").not().isEmpty(),
    body("checkname").trim(),
    body("url").not().isEmpty(),
    body("url").trim(),
    body("protocol").not().isEmpty(),
    body("protocol").trim(),
    body("protocol").not().isEmpty(),
    body("protocol").trim(),
    body("user_id").not().isEmpty(),
    body("user_id").trim(),
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
