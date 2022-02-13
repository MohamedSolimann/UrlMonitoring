const express = require("express");
const router = express.Router();
const {
  userAuthentication,
  userEmailVerification,
} = require("../../Models/user-model/index");
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
      const token = await userAuthentication(email, password);
      res.cookie("token", token);
      res.status(201).json({ message: "Success" });
    } catch (error) {
      if (error.message) {
        res.status(400).json({ message: "Error", error: error.message });
      } else {
        p;
        res.status(500).json({ message: "Error" });
      }
    }
  }
);
router.post("/verify/:id", async (req, res) => {
  const { OTP } = req.body;
  const userId = req.params.id;
  try {
    const emailVerified = await userEmailVerification(userId, OTP);
    if (emailVerified) {
      res.status(201).json({ message: "Success" });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Please check the user id" });
    } else if (error.message) {
      res.status(400).json({ message: "Error", error: error.message });
    } else {
      res.status(500).json({ message: "Error", error });
    }
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
