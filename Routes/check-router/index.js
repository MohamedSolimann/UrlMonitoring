const mongoose = require("mongoose");
const checkModel = require("../../Models/check-model/check.schema");

async function getCheckStatus(checkId) {
  const check = await checkModel.findOne({ _id: checkId }).lean();
  return check.status;
}
module.exports = { getCheckStatus };
