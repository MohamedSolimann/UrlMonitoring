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
      url: url,
      status: status,
      availability: availability,
      outages: outages,
      downtime: downtime,
      uptime: uptime,
      responsetime: responsetime,
      history: history,
    });
    await newReport.save();
    console.log("report created ");
  } catch (error) {
    console.log("error");
  }
}
module.exports = { createReport };
