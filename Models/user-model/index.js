const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("./user.schema");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../verify/email-verification");

async function createUser(user) {
  try {
    let udaptedUser = updateUserForCreation(user);
    let newUser = new userModel(udaptedUser);
    await newUser.save();
    if (newUser) {
      // sendEmail({
      //   to: user.email,
      //   from: "ahmdsolmn@gmail.com",
      //   subject: "Email Verification",
      //   text: "Email Verification",
      //   html: `<body><p> Email Verification : ${udaptedUser.OTP}</p></body>`,
      // });
    }
  } catch (error) {
    throw error;
  }
}
async function getUserByEmail(email) {
  let user = await userModel.findOne({ email });
  return user;
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
  const users = await userModel.find({ deletedAt: null }).lean();
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
async function deleteUserById(userId) {
  try {
    let user = await getUserById(userId);
    let deleteUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: { deletedAt: Date() } },
      { new: true }
    );
    if (deleteUser) {
      return deleteUser;
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

async function userAuthentication(email, password) {
  const user = await getUserByEmail(email);
  if (user) {
    if (user.verify === "Active") {
      let verifyPassword = bcrypt.compareSync(password, user.password);
      if (verifyPassword) {
        const token = jwt.sign({ id: user._id }, "secret");
        return token;
      } else {
        throw new Error("Password is incorrect ,Please try again");
      }
    } else {
      throw new Error("Please verify your email");
    }
  } else {
    throw new Error("Email is not associated with any account");
  }
}
async function userEmailVerification(userId, OTP) {
  const user = await getUserById({ _id: userId });
  if (OTP === user.OTP) {
    let user = await updateUserById(userId, { verify: "Active" });
    return true;
  } else {
    throw new Error("OTP is incorrect");
  }
}
module.exports = {
  updateRequestBody,
  createUser,
  getUserByEmail,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  userAuthentication,
  userEmailVerification,
};
