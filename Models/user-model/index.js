const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("./user.schema");
const sendEmail = require("../../verify/email-verification");

async function createUser(user) {
  try {
    let udaptedUser = updateUserForCreation(user);
    let newUser = new userModel(udaptedUser);
    await newUser.save();
    if (newUser) {
      sendEmail({
        to: user.email,
        from: "ahmdsolmn@gmail.com",
        subject: "Email Verification",
        text: "Email Verification",
        html: `<body><p> Email Verification : ${updatedUser.OTP}</p></body>`,
      });
    }
  } catch (error) {
    throw error;
  }
}
async function getUserByEmail(email) {
  let user = await userModel.findOne({ email });
  if (user) {
    throw new Error("Email is already in use");
  }
}
function updateUserForCreation(user) {
  let OTP = Math.floor(Math.random() * 9000 + 1000);
  user._id = mongoose.Types.ObjectId();
  const encryptedPassword = bcrypt.hashSync(user.password, 8);
  user.password = encryptedPassword;
  user.verify = "Pending";
  user.OTP = OTP;
  return user;
}
function updateRequestBody(req) {
  let updatedBody = {};
  if (req.body.username) {
    updatedBody.username = req.body.username;
  }
  if (req.body.password) {
    updatedBody.password = req.body.password;
  }
  if (req.body.email) {
    updatedBody.email = req.body.email;
  }
  return updatedBody;
}

module.exports = { updateRequestBody, createUser, getUserByEmail };
