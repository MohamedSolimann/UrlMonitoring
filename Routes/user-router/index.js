const express = require("express");
const router = express.Router();
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../../Models/user-model/user.schema");
const {
  signinValidation,
  catchValidationErrors,
} = require("../../validation/user.validation");

router.post(
  "/signin",
  signinValidation,
  catchValidationErrors,
  async (req, res) => {
    const { email, password } = req.body;
    try {
      let user = await userModel.findOne({ email });
      if (user) {
        let verifyPassword = bycrypt.compareSync(password, user.password);
        if (verifyPassword) {
          const token = jwt.sign({ id: user._id }, "secret");
          res.cookie("Token", token);
          res.status(200).json({ message: "Success" });
        } else {
          res
            .status(400)
            .json({ message: "Password is incorrect ,Please try again" });
        }
      } else {
        res
          .status(400)
          .json({ message: "Email is incorrect ,Please try again" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error" });
    }
  }
);
router.get("/userauth", async (req, res) => {
  try {
    let token = req.cookies["Token"];
    if (token) {
      res.status(200).json({ message: "Success" });
    } else {
      res.status(401).json({ message: "User not authorizied" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});
router.get("/signout", async (req, res) => {
  try {
    res.clearCookie("Token");
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
