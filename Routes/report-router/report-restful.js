const express = require("express");
const router = express.Router();
const { getReportById } = require("../../Models/report-model/index");
const { userAuthentication } = require("../user-router/middleware");

router.get("/:id", userAuthentication, async (req, res) => {
  const reportId = req.params.id;
  try {
    let report = await getReportById(reportId);
    res.status(200).json({ message: "Success", data: report });
  } catch (error) {
    if (error.message) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ message: "Error", error });
    }
  }
});

module.exports = router;
