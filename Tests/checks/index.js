const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);

async function createNewCheck() {
  const response = await request.post("/checks").send({
    _id: mongoose.Types.ObjectId(),
    user_id: mongoose.Types.ObjectId(),
    checkname: "test",
    url: "testurl",
    protocol: "testprotocol",
    path: "testpath",
    port: 1111,
    webhook: "testwebhook",
    tag: "testtag",
    status: "Active",
  });
  return response.body.data;
}
async function deleteCheck(checkId) {
  const reponse = await request.delete(`/checks/${checkId}`);
}

module.exports = { createNewCheck, deleteCheck };
