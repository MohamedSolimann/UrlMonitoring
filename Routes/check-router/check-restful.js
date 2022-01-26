const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkModel = require("../../Models/check-model/check.schema");
const { updateRequestBody } = require("../../Models/check-model/index");
const {
  checkCreation,
  catchValidationErrors,
} = require("../../validation/check.validation");
const { userAuthentication } = require("../user-router/index");
const URLMonitoring = require("../monitor/index");

router.post(
  "/",
  userAuthentication,
  checkCreation,
  catchValidationErrors,
  async (req, res) => {
    const {
      checkname,
      url,
      protocol,
      path,
      port,
      webhook,
      tag,
      status,
      user_id,
    } = req.body;
    try {
      let newCheck = new checkModel({
        _id: mongoose.Types.ObjectId(),
        user_id,
        checkname,
        url,
        protocol,
        path,
        port,
        webhook,
        tag,
        status,
      });
      await newCheck.save();
      URLMonitoring(url, webhook, newCheck._id);
      res.status(201).json({ message: "Success", data: newCheck });
    } catch (error) {
      if (error.message) {
        res.status(400).json({ message: "Invalid Info!" });
      } else {
        res.status(500).json({ message: "Error", error });
      }
    }
  }
);
router.get("/", userAuthentication, async (req, res) => {
  try {
    let checks = await checkModel.find({ deletedDate: null });
    if (checks.length !== 0) {
      res.status(200).json({ message: "Success", data: checks });
    } else {
      res.status(200).json({ message: "There is no Checks!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.get("/:id", async (req, res) => {
  const checkId = req.params.id;
  try {
    let check = await checkModel.findOne({ _id: checkId }).lean();
    if (check) {
      if (check.deletedDate) {
        res.status(400).json({ message: "check no longer exists!" });
      } else {
        res.status(200).json({ message: "Success", data: check });
      }
    } else {
      res.status(400).json({ message: "Please check the check id" });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Please check the check id" });
    } else {
      res.status(500).json({ message: "Error", error });
    }
  }
});
router.put("/:id", userAuthentication, async (req, res) => {
  let checkId = req.params.id;
  try {
    let check = await checkModel.findOne({ _id: checkId });
    if (check) {
      let updatedBody = await updateRequestBody(req);
      var updatedCheck = await checkModel.findOneAndUpdate(
        { _id: check._id },
        { $set: updatedBody },
        { new: true }
      );
    }
    res.status(201).json({ message: "Success", data: updatedCheck });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.delete("/:id", userAuthentication, async (req, res) => {
  let checkId = req.params.id;
  try {
    let check = await checkModel.findOne({ _id: checkId });
    if (check) {
      let deletedCheck = await checkModel.findOneAndUpdate(
        { _id: checkId },
        { $set: { deletedDate: Date(), status: "Paused" } }
      );
    }
    res.status(202).json({ message: "Success" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Please check the check id" });
    } else {
      res.status(500).json({ message: "Error", error });
    }
  }
});

module.exports = router;
