const express = require("express");
const router = express.Router();
const { createUser, getUserByEmail } = require("../../Models/user-model/index");
const { updateRequestBody } = require("../../Models/user-model/index");
const {
  signupValidation,
  catchValidationErrors,
} = require("../../validation/user.validation");
const { userAuthentication } = require("../user-router/index");

router.post("/", signupValidation, catchValidationErrors, async (req, res) => {
  try {
    await getUserByEmail(req.body.email);
    const newUser = createUser(req.body);
    res.status(201).json({ message: "Success", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});
router.get("/", userAuthentication, async (req, res) => {
  try {
    let users = await userModel.find({ deletedDate: null });
    if (users.length !== 0) {
      res.status(200).json({ message: "Success", data: users });
    } else {
      res.status(200).json({ message: "There is no Users!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.get("/:id", userAuthentication, async (req, res) => {
  const userId = req.params.id;
  try {
    let user = await userModel.findOne({ _id: userId }).lean();
    if (user) {
      if (user.deletedDate) {
        res.status(400).json({ message: "User no longer exists!" });
      } else {
        delete user.password;
        res.status(200).json({ message: "Success", data: user });
      }
    } else {
      res.status(400).json({ message: "Please check the user id" });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Please check the user id" });
    } else {
      res.status(500).json({ message: "Error", error });
    }
  }
});
router.put("/:id", userAuthentication, async (req, res) => {
  let userId = req.params.id;
  try {
    let user = await userModel.findOne({ _id: userId });
    if (user) {
      let updatedBody = await updateRequestBody(req);
      var updatedUser = await userModel.findOneAndUpdate(
        { _id: user._id },
        { $set: updatedBody },
        { new: true }
      );
    }
    res.status(201).json({ message: "Success", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.delete("/:id", userAuthentication, async (req, res) => {
  let userId = req.params.id;
  try {
    let user = await userModel.findOne({ _id: userId });
    if (user) {
      let deletedUser = await userModel.findOneAndUpdate(
        { _id: userId },
        { $set: { deletedDate: Date() } }
      );
    }
    res.status(202).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
