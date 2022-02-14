const mongoose = require("mongoose");
const checkModel = require("../../Models/check-model/check.schema");

async function createCheck(check) {
  try {
    const updatedCheck = updateCheckForCreation(check);
    let newCheck = new checkModel(updatedCheck);
    await newCheck.save();
    return newCheck;
  } catch (error) {
    throw error;
  }
}
async function getCheckById(checkId) {
  const check = await checkModel.findOne({ _id: checkId });
  if (check) {
    return check;
  } else {
    throw new Error("Check not found!");
  }
}
async function getChecks() {
  try {
    const checks = await checkModel.find({ deletedAt: null });
    return checks;
  } catch (error) {
    throw error;
  }
}
function updateCheckForCreation(check) {
  check._id = mongoose.Types.ObjectId();
  check.ceratedAt = new Date();
  return check;
}
function updateRequestBody(req) {
  let updatedBody = {};
  if (req.body.checkname) {
    updatedBody.checkname = req.body.checkname;
  }
  if (req.body.url) {
    updatedBody.url = req.body.url;
  }
  if (req.body.protocol) {
    updatedBody.protocol = req.body.protocol;
  }
  if (req.body.path) {
    updatedBody.path = req.body.path;
  }
  if (req.body.webhook) {
    updatedBody.webhook = req.body.webhook;
  }
  if (req.body.port) {
    updatedBody.port = req.body.port;
  }
  if (req.body.status) {
    updatedBody.status = req.body.status;
  }
  if (req.body.timeout) {
    updatedBody.timeout = req.body.timeout;
  }
  if (req.body.interval) {
    updatedBody.interval = req.body.interval;
  }
  return updatedBody;
}

module.exports = { updateRequestBody, createCheck, getCheckById, getChecks };
