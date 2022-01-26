const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);

async function createNewUser() {
  const response = await request.post("/users").send({
    username: "mohamed",
    email: "a@a.com",
    password: "123123123",
  });
  return response.body.data;
}
async function userSignIn() {
  const response = await request.post("/users/auth/signin").send({
    email: "a@a.com",
    password: "123123123",
  });
  return response.headers["set-cookie"][0];
}
async function deleteUser(userId, token) {
  const reponse = await request.delete(`/users/${userId}`).set("Cookie", token);
}
module.exports = { createNewUser, deleteUser, userSignIn };
