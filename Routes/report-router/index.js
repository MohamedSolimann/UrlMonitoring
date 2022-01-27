const mongoose = require("mongoose");
const reportModel = require("../../Models/report-model/report-schema");

async function createReport(
  url,
  status,
  availability,
  outages,
  downtime,
  uptime,
  responsetime,
  history
) {
  try {
    let newReport = new reportModel({
      _id: mongoose.Types.ObjectId(),
      url,
      status,
      availability,
      outages,
      downtime,
      uptime,
      responsetime,
      history,
    });
    await newReport.save();
  } catch (error) {
    console.log("error");
  }
}
module.exports = { createReport };
