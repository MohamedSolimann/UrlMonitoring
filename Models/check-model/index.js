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
async function updatedCheckById(checkId, body) {
  let check = await getCheckById(checkId);
  try {
    let updatedRequestBody = updateRequestBody(body);
    let updatedCheck = await checkModel.findOneAndUpdate(
      { _id: checkId },
      { $set: updatedRequestBody },
      { new: true }
    );
    return updatedCheck;
  } catch (error) {
    throw error;
  }
}
async function deletedCheck(checkId) {
  const check = await getCheckById(checkId);
  try {
    let deletedCheck = await checkModel.findOneAndUpdate(
      { _id: checkId },
      { $set: { deletedAt: Date(), status: "Paused" } }
    );
    return deletedCheck;
  } catch (error) {
    throw error;
  }
}
function updateCheckForCreation(check) {
  check._id = mongoose.Types.ObjectId();
  check.createdAt = new Date();
  return check;
}
function updateRequestBody(body) {
  let updatedBody = {};
  if (body.checkname) {
    updatedBody.checkname = body.checkname;
  }
  if (body.url) {
    updatedBody.url = body.url;
  }
  if (body.protocol) {
    updatedBody.protocol = body.protocol;
  }
  if (body.path) {
    updatedBody.path = body.path;
  }
  if (body.webhook) {
    updatedBody.webhook = body.webhook;
  }
  if (body.port) {
    updatedBody.port = body.port;
  }
  if (body.status) {
    updatedBody.status = body.status;
  }
  if (body.timeout) {
    updatedBody.timeout = body.timeout;
  }
  if (body.interval) {
    updatedBody.interval = body.interval;
  }
  if (body.deletedAt) {
    updatedBody.deletedAt = body.deletedAt;
  }
  if (body.createdAt) {
    updatedBody.createdAt = body.createdAt;
  }
  return updatedBody;
}

module.exports = {
  updateRequestBody,
  createCheck,
  getCheckById,
  getChecks,
  updatedCheckById,
  deletedCheck,
};
