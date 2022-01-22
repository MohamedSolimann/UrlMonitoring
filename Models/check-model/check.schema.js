const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var checkSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  checkname: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  protocol: {
    type: String,
    required: true,
  },
  path: {
    type: String,
  },
  port: {
    type: Number,
  },
  tag: {
    type: String,
  },
  webhook: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ["Paused", "Active"],
  },
  deletedDate: { type: Date },
});

//Export the model
module.exports = mongoose.model("Check", checkSchema);
