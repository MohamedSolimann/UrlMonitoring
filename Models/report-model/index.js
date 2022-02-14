const mongoose = require("mongoose");
const reportModel = require("../../Models/report-model/report-schema");

async function createReport(report) {
  try {
    const updatedReport = updatedReportForCreation(report);
    const newReport = new reportModel(updatedReport);
    await newReport.save();
    return newReport;
  } catch (error) {
    throw error;
  }
}
async function getReportById(reportId) {
  const report = await reportModel.findOne({ _id: reportId });
  if (report) {
    return report;
  } else {
    throw new Error("No report found!");
  }
}
function updatedReportForCreation(report) {
  report._id = mongoose.Types.ObjectId();
  report.createdAt = new Date();
  return report;
}

module.exports = { updateRequestBody, createReport, getReportById };
