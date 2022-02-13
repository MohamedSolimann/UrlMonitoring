const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserByEmail,
  getUsers,
  getUserById,
  updateUserById,
} = require("../../Models/user-model/index");
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
    const users = await getUsers();
    res.status(200).json({ message: "Success", data: users });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});
router.get("/:id", userAuthentication, async (req, res) => {
  try {
    let user = await getUserById(req.params.id);
    if (user) {
      delete user.password;
      res.status(200).json({ message: "Success", data: user });
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
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await updateUserById(req.params.id, req.body);
    res.status(201).json({ message: "Success", data: updatedUser });
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
