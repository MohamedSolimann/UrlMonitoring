const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
  },
  verify: {
    type: String,
    enum: ["Pending", "Active"],
    required: true,
  },
  OTP: {
    type: Number,
    require: true,
  },
});

//Export the model
module.exports = mongoose.model("User", userSchema);
