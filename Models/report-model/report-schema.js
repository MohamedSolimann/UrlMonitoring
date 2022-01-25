const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var reportSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  url: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  availability: {
    type: String,
    required: true,
  },
  outages: {
    type: Number,
    required: true,
  },
  downtime: {
    type: Number,
    required: true,
  },
  uptime: {
    type: Number,
    required: true,
  },
  responsetime: {
    type: Number,
    required: true,
  },
  history: {
    type: Date,
    required: true,
  },
  deletedDate: {
    type: Date,
  },
});

//Export the model
module.exports = mongoose.model("Report", reportSchema);
