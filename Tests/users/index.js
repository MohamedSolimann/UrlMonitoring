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
async function deleteUser(userId) {
  const reponse = await request.delete(`/users/${userId}`);
}

module.exports = { createNewUser, deleteUser };
