const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);

let userId, OTP;
async function createNewUser() {
  const response = await request.post("/users").send({
    username: "mohamed",
    email: "a@a.com",
    password: "123123123",
  });
  userId = response.body.data._id;
  OTP = response.body.data.OTP;
  return response.body.data;
}
async function userSignIn() {
  const response = await request.post("/users/auth/signin").send({
    email: "a@a.com",
    password: "123123123",
  });
  console.log(response.body);
  return response.headers["set-cookie"][0];
}
async function verifyUser() {
  const response = await request.post(`/users/auth/verify/${userId}`).send({
    OTP,
  });
  return response.body.data;
}
async function deleteUser(userId, token) {
  const reponse = await request.delete(`/users/${userId}`).set("Cookie", token);
}
module.exports = { createNewUser, deleteUser, userSignIn, verifyUser };
