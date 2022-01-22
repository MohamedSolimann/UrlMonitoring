const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);
const mongoose = require("mongoose");
const { createNewCheck, deleteCheck } = require("./index");

const createEndpointTestCases = () => {
  it("Suppose to create new check", async () => {
    const response = await request.post("/checks").send({
      _id: mongoose.Types.ObjectId(),
      user_id: mongoose.Types.ObjectId(),
      checkname: "test",
      url: "testurl",
      protocol: "testprotocol",
      path: "testpath",
      port: "123",
      webhook: "testwebhook",
      tag: "testtag",
      status: "Active",
    });
    expect(response.status).toBe(201);
    expect(response.body.data.checkname).toBe("test");
    expect(response.body.data.url).toBe("testurl");
    expect(response.body.data.path).toBe("testpath");
    expect(response.body.data.protocol).toBe("testprotocol");
    expect(response.body.data.port).toBe(123);
    expect(response.body.data.webhook).toBe("testwebhook");
    expect(response.body.data.tag).toBe("testtag");
    expect(response.body.data.status).toBe("Active");
  });
  it("Suppose to get checkname validtaion error from create endpoint", async () => {
    const response = await request.post("/checks").send({
      checkname: "",
      _id: mongoose.Types.ObjectId(),
      user_id: mongoose.Types.ObjectId(),
      url: "testurl",
      protocol: "testprotocol",
      path: "testpath",
      port: "111",
      webhook: "testwebhook",
      tag: "testtag",
      status: "teststatus",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get url validtaion error from create endpoint", async () => {
    const response = await request.post("/checks").send({
      _id: mongoose.Types.ObjectId(),
      user_id: mongoose.Types.ObjectId(),
      checkname: "test",
      url: "",
      protocol: "testprotocol",
      path: "testpath",
      port: "111",
      webhook: "testwebhook",
      tag: "testtag",
      status: "Active",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get protocol validtaion error from create endpoint", async () => {
    const response = await request.post("/checks").send({
      _id: mongoose.Types.ObjectId(),
      user_id: mongoose.Types.ObjectId(),
      checkname: "test",
      url: "testurl",
      protocol: "",
      path: "testpath",
      port: "111",
      webhook: "testwebhook",
      tag: "testtag",
      status: "Active",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get port validtaion error from create endpoint", async () => {
    const response = await request.post("/checks").send({
      _id: mongoose.Types.ObjectId(),
      user_id: mongoose.Types.ObjectId(),
      checkname: "test",
      url: "testurl",
      protocol: "testprotocol",
      path: "testpath",
      port: "testport",
      webhook: "testwebhook",
      tag: "testtag",
      status: "Active",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("port must be a number");
  });
  it("Suppose to get status validtaion error from create endpoint", async () => {
    const response = await request.post("/users").send({
      _id: mongoose.Types.ObjectId(),
      user_id: mongoose.Types.ObjectId(),
      checkname: "test",
      url: "testurl",
      protocol: "testprotocol",
      path: "testpath",
      port: "123",
      webhook: "testwebhook",
      tag: "testtag",
      status: "not vaild enum",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
};
const readEndpointTestCases = () => {
  it("Suppose to get check by id", async () => {
    let newcheck = await createNewCheck();
    const response = await request.get(`/checks/${newcheck._id}`);
    expect(response.status).toBe(200);
    expect(response.body.data._id).toBe(newcheck._id);
    expect(response.body.data.user_id).toBe(newcheck.user_id);
    expect(response.body.data.checkname).toBe("test");
    expect(response.body.data.url).toBe("testurl");
    expect(response.body.data.path).toBe("testpath");
    expect(response.body.data.protocol).toBe("testprotocol");
    expect(response.body.data.port).toBe(1111);
    expect(response.body.data.webhook).toBe("testwebhook");
    expect(response.body.data.tag).toBe("testtag");
    expect(response.body.data.status).toBe("Active");
  });
  it("Suppose to get error invalid check id ", async () => {
    let checkId = "Invalid check id";
    const response = await request.get(`/checks/${checkId}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please check the check id");
  });
  it("Suppose to get error check no longer exists ", async () => {
    let newCheck = await createNewCheck();
    await deleteCheck(newCheck._id);
    const response = await request.get(`/checks/${newCheck._id}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("check no longer exists!");
  });
  it("Suppose to get all checks ", async () => {
    let newCheck = await createNewCheck();
    const response = await request.get("/checks");
    const responseData = response.body.data;
    expect(response.status).toBe(200);
    expect(responseData[responseData.length - 1].checkname).toBe("test");
    expect(responseData[responseData.length - 1]._id).toBe(newCheck._id);
    expect(responseData[responseData.length - 1].user_id).toBe(
      newCheck.user_id
    );
    expect(responseData[responseData.length - 1].checkname).toBe("test");
    expect(responseData[responseData.length - 1].url).toBe("testurl");
    expect(responseData[responseData.length - 1].path).toBe("testpath");
    expect(responseData[responseData.length - 1].protocol).toBe("testprotocol");
    expect(responseData[responseData.length - 1].port).toBe(1111);
    expect(responseData[responseData.length - 1].webhook).toBe("testwebhook");
    expect(responseData[responseData.length - 1].tag).toBe("testtag");
    expect(responseData[responseData.length - 1].status).toBe("Active");
  });
};
const udpateEndpointTestCases = () => {
  it("Suppose to update check ", async () => {
    let newCheck = await createNewCheck();
    let oldCheckname = newCheck.checkname;
    const response = await request
      .put(`/checks/${newCheck._id}`)
      .send({ checkname: "updated checkname" });
    let updatedCheckname = response.body.data.checkname;
    expect(response.status).toBe(201);
    expect(oldCheckname).not.toEqual(updatedCheckname);
    expect(response.body.data.checkname).toEqual("updated checkname");
  });
};
const deleteEndpointTestCases = () => {
  it("Suppose to delete check ", async () => {
    let newCheck = await createNewCheck();
    let checkId = newCheck._id;
    let response = await request.delete(`/checks/${checkId}`);
    expect(response.status).toBe(202);
    expect(response.body.message).toBe("Success");
  });
};
const restApiTestCases = () => {
  createEndpointTestCases();
  readEndpointTestCases();
  udpateEndpointTestCases();
  deleteEndpointTestCases();
};

describe("Testing Restful API for users", restApiTestCases);
