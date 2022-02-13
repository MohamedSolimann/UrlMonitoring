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
async function getUsers() {
  const users = await userModel.find({ deletedDate: null }).lean();
  if (users) {
    return users;
  } else {
    throw new Error("No users found!");
  }
}
async function getUserById(userId) {
  try {
    const user = await userModel.findOne({ _id: userId }).lean();
    if (user) {
      return user;
    } else if (user === null) {
      throw new Error("No user found!");
    }
  } catch (error) {
    throw error;
  }
}
async function updateUserById(userId, body) {
  try {
    let user = await getUserById(userId);
    let udpatedRequestBody = updateRequestBody(body);
    let updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: udpatedRequestBody },
      { new: true }
    );
    if (updatedUser) {
      return updatedUser;
    }
  } catch (error) {
    throw error;
  }
}
function updateRequestBody(body) {
  let updatedBody = {};
  if (body.username) {
    updatedBody.username = body.username;
  }
  if (body.password) {
    updatedBody.password = body.password;
  }
  if (body.email) {
    updatedBody.email = body.email;
  }
  if (body.verify) {
    updatedBody.verify = body.verify;
  }
  return updatedBody;
}

module.exports = {
  updateRequestBody,
  createUser,
  getUserByEmail,
  getUsers,
  getUserById,
  updateUserById,
};
