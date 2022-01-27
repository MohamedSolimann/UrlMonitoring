const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const reportModel = require("../../Models/report-model/report-schema");

const { userAuthentication } = require("../user-router/index");

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

module.exports = router;
