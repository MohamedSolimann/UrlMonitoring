const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const reportModel = require("../../Models/report-model/report-schema");
const { updateRequestBody } = require("../../Models/report-model/index");
const {
  reportValidation,
  catchValidationErrors,
} = require("../../validation/report.validation");
const { userAuthentication } = require("../user-router/index");
router.post(
  "/",
  userAuthentication,
  reportValidation,
  catchValidationErrors,
  async (req, res) => {
    const {
      status,
      availability,
      uptime,
      downtime,
      responsetime,
      history,
      outages,
      url,
    } = req.body;
    try {
      let newReport = new reportModel({
        _id: mongoose.Types.ObjectId(),
        status,
        availability,
        uptime,
        downtime,
        responsetime,
        history,
        outages,
        url,
      });
      await newReport.save();
      res.status(201).json({ message: "Success", data: newReport });
    } catch (error) {
      res.status(500).json({ message: "Error", error });
    }
  }
);
router.get("/", userAuthentication, async (req, res) => {
  try {
    let reports = await reportModel.find({ deletedDate: null });
    if (reports.length !== 0) {
      res.status(200).json({ message: "Success", data: reports });
    } else {
      res.status(200).json({ message: "There is no reports!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.get("/:id", userAuthentication, async (req, res) => {
  const reportId = req.params.id;
  try {
    let report = await reportModel.findOne({ _id: reportId }).lean();
    if (report) {
      if (report.deletedDate) {
        res.status(400).json({ message: "Report no longer exists!" });
      } else {
        res.status(200).json({ message: "Success", data: report });
      }
    } else {
      res.status(400).json({ message: "Please check the report id" });
    }
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ message: "Please check the report id" });
    } else {
      res.status(500).json({ message: "Error", error });
    }
  }
});
router.put("/:id", userAuthentication, async (req, res) => {
  let reportId = req.params.id;
  try {
    let report = await reportModel.findOne({ _id: reportId });
    if (report) {
      let updatedBody = await updateRequestBody(req);
      var updatedReport = await reportModel.findOneAndUpdate(
        { _id: reportId },
        { $set: updatedBody },
        { new: true }
      );
    }
    res.status(201).json({ message: "Success", data: updatedReport });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.delete("/:id", userAuthentication, async (req, res) => {
  let reportId = req.params.id;
  try {
    let report = await reportModel.findOne({ _id: reportId });
    if (report) {
      let deletedReport = await reportModel.findOneAndUpdate(
        { _id: reportId },
        { $set: { deletedDate: Date() } }
      );
    }
    res.status(202).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Error" });
  }
});

module.exports = router;
