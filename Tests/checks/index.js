const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../index");
const { createNewUser, userSignIn } = require("../users/index");
const request = supertest(app);
async function createNewCheck() {
  let newUser = await createNewUser();
  let token = await userSignIn();
  const response = await request
    .post("/checks")
    .send({
      user_id: mongoose.Types.ObjectId(),
      checkname: "test",
      url: "testurl",
      protocol: "testprotocol",
      path: "testpath",
      port: 1111,
      webhook: "testwebhook",
      tag: "testtag",
      status: "Active",
    })
    .set("Cookie", token);
  return response.body.data;
}
async function deleteCheck(checkId, token) {
  const reponse = await request
    .delete(`/checks/${checkId}`)
    .set("Cookie", token);
}

module.exports = { createNewCheck, deleteCheck };
