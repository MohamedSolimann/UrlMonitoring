const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserByEmail,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../../Models/user-model/index");
const { createUserkValidation, reqParamsValidation } = require("./middleware");
const { userAuthentication } = require("../user-router/index");

router.post(
  "/",
  userAuthentication,
  createUserkValidation,
  async (req, res) => {
    try {
      const user = await getUserByEmail(req.body.email);
      if (user) {
        throw "Email already exists";
      }
      const newUser = createUser(req.body);
      res.status(201).json({ message: "Success", data: newUser });
    } catch (error) {
      if (error.message) {
        res.status(400).json({ message: "Error", error: error.message });
      } else {
        res.status(500).json({ message: "Error", error: error.message });
      }
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json({ message: "Success", data: users });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
});
router.get("/:id", reqParamsValidation, async (req, res) => {
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
router.put(
  "/:id",
  userAuthentication,
  reqParamsValidation,
  async (req, res) => {
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
  }
);
router.delete(
  "/:id",
  userAuthentication,
  reqParamsValidation,
  async (req, res) => {
    try {
      let deletedUser = await deleteUserById(req.params.id);
      res.status(202).json({ message: "Success" });
    } catch (error) {
      if (error.kind === "ObjectId") {
        res.status(400).json({ message: "Please check the user id" });
      } else if (error.message) {
        res.status(400).json({ message: "Error", error: error.message });
      } else {
        res.status(500).json({ message: "Error", error });
      }
    }
  }
);

module.exports = router;
