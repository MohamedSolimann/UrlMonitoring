const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);
const mongoose = require("mongoose");
const { createNewUser, deleteUser, userSignIn } = require("./index");
const { setupDB } = require("../testDBSetup");

setupDB();

const createEndpointTestCases = () => {
  it("Suppose to create new user", async () => {
    const response = await request.post("/users").send({
      _id: mongoose.Types.ObjectId(),
      username: "mohamed",
      email: "a@a.com",
      password: "123123123",
    });
    expect(response.status).toBe(201);
    expect(response.body.data.username).toBe("mohamed");
    expect(response.body.data.email).toBe("a@a.com");
    expect(response.body.data.verify).toBe("Pending");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/users").send({
      name: "",
      email: "a@a.com",
      password: "123123123",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/users").send({
      name: "mohamed",
      email: "",
      password: "123123123",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/users").send({
      name: "mohamed",
      email: "a@a.com",
      password: "",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/users").send({
      name: "mohamed",
      email: "a@a",
      password: "123123123",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("Suppose to get validtaion error from create endpoint", async () => {
    const response = await request.post("/users").send({
      name: "",
      email: "a@a.com",
      password: "123123",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
};
const readEndpointTestCases = () => {
  it("Suppose to get user by id", async () => {
    let newUser = await createNewUser();
    let token = await userSignIn();
    const response = await request
      .get(`/users/${newUser._id}`)
      .set("Cookie", token);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("mohamed");
    expect(response.body.data.email).toBe("a@a.com");
    expect(response.body.data.verify).toBe("Pending");
  });
  it("Suppose to get error invalid user id ", async () => {
    let newUser = await createNewUser();
    let token = await userSignIn();
    let userId = "Invalid user id";
    const response = await request.get(`/users/${userId}`).set("Cookie", token);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please check the user id");
  });
  it("Suppose to get error user no longer exists ", async () => {
    let newUser = await createNewUser();
    let token = await userSignIn();
    await deleteUser(newUser._id, token);
    const response = await request
      .get(`/users/${newUser._id}`)
      .set("Cookie", token);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User no longer exists!");
  });
  it("Suppose to get error not authorizied ", async () => {
    let newUser = await createNewUser();
    const response = await request.get(`/users/${newUser._id}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("User not authorizied");
  });
  it("Suppose to get all users ", async () => {
    let newUser = await createNewUser();
    let token = await userSignIn();
    const response = await request.get("/users").set("Cookie", token);
    expect(response.status).toBe(200);
    expect(response.body.data[0].username).toBe("mohamed");
  });
};
const udpateEndpointTestCases = () => {
  it("Suppose to update user ", async () => {
    let newUser = await createNewUser();
    let token = await userSignIn();
    let oldUsername = newUser.username;
    const response = await request
      .put(`/users/${newUser._id}`)
      .set("Cookie", token)
      .send({ username: "test name" });
    let updatedUsername = response.body.data.username;
    expect(response.status).toBe(201);
    expect(oldUsername).not.toEqual(updatedUsername);
    expect(response.body.data.username).toEqual("test name");
  });
  it("Suppose to get error not authorizied ", async () => {
    let newUser = await createNewUser();
    const response = await request
      .put(`/users/${newUser._id}`)
      .send({ username: "test name" });
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("User not authorizied");
  });
};
const deleteEndpointTestCases = () => {
  it("Suppose to delete user ", async () => {
    let newUser = await createNewUser();
    let token = await userSignIn();
    let userId = newUser._id;
    let response = await request
      .delete(`/users/${userId}`)
      .set("Cookie", token);
    expect(response.status).toBe(202);
    expect(response.body.message).toBe("Success");
  });
  it("Suppose to get error not authorizied ", async () => {
    let newUser = await createNewUser();
    let userId = newUser._id;
    let response = await request.delete(`/users/${userId}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("User not authorizied");
  });
};
const verifyEndpointTestCases = () => {
  it("Suppose to verify user ", async () => {
    let newUser = await createNewUser();
    let userId = newUser._id;
    let OTP = newUser.OTP;
    let response = await request
      .post("/users/auth/verify/")
      .send({ userId, OTP });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Success");
  });
  it("Suppose to get OTP is not correct  ", async () => {
    let newUser = await createNewUser();
    let userId = newUser._id;
    let OTP = 1233;
    let response = await request
      .post("/users/auth/verify/")
      .send({ userId, OTP });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("OTP is incorrect");
  });
  it("Suppose to get check user id", async () => {
    let newUser = await createNewUser();
    let userId = "not correct user id";
    let OTP = newUser;
    let response = await request
      .post("/users/auth/verify/")
      .send({ userId, OTP });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please check the user id");
  });
};
const restApiTestCases = () => {
  createEndpointTestCases();
  readEndpointTestCases();
  udpateEndpointTestCases();
  deleteEndpointTestCases();
  verifyEndpointTestCases();
};
describe("Testing Restful API for users", restApiTestCases);
