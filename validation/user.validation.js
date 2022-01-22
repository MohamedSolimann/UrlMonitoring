const { body, validationResult } = require("express-validator");

module.exports = {
  signupValidation: [
    body("email").isEmail(),
    body("email").not().isEmpty(),
    body("email").trim(),
    body("username").not().isEmpty(),
    body("username").trim(),
    body("password").not().isEmpty(),
    body("password").isLength({ min: 8, max: 16 }),
  ],
  signinValidation: [
    body("email").isEmail(),
    body("email").not().isEmpty(),
    body("password").not().isEmpty(),
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
