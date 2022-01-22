const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);
const mongoose = require("mongoose");
const { createNewUser, deleteUser } = require("./index");

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
    const response = await request.get(`/users/${newUser._id}`);
    expect(response.status).toBe(200);
    expect(response.body.data.username).toBe("mohamed");
  });
  it("Suppose to get error invalid user id ", async () => {
    let petId = "Invalid user id";
    const response = await request.get(`/users/${petId}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please check the user id");
  });
  it("Suppose to get error user no longer exists ", async () => {
    let newUser = await createNewUser();
    await deleteUser(newUser._id);
    const response = await request.get(`/users/${newUser._id}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User no longer exists!");
  });
  it("Suppose to get all users ", async () => {
    let newUser = await createNewUser();
    const response = await request.get("/users");
    expect(response.status).toBe(200);
    expect(response.body.data[0].username).toBe("mohamed");
  });
};
const udpateEndpointTestCases = () => {
  it("Suppose to update pet ", async () => {
    let newUser = await createNewUser();
    let oldUsername = newUser.username;
    const response = await request
      .put(`/users/${newUser._id}`)
      .send({ username: "test name" });
    let updatedUsername = response.body.data.username;
    expect(response.status).toBe(201);
    expect(oldUsername).not.toEqual(updatedUsername);
    expect(response.body.data.username).toEqual("test name");
  });
};
const deleteEndpointTestCases = () => {
  it("Suppose to delete pet ", async () => {
    let newUser = await createNewUser();
    let userId = newUser._id;
    let response = await request.delete(`/users/${userId}`);
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
