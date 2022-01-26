const supertest = require("supertest");
const app = require("../../index");
const { setupDB } = require("../testDBSetup");
const request = supertest(app);
const { createNewUser } = require("./index");
setupDB();
describe("user authentication endpoints", () => {
  it("user signin successful", async () => {
    let newUser = await createNewUser();
    const response = await request.post("/users/auth/signin").send({
      email: "a@a.com",
      password: "123123123",
    });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
    expect(response.headers["set-cookie"][0][6]).not.toBe(";");
  });
  it("user entered incorrect email", async () => {
    const response = await request.post("/users/auth/signin").send({
      email: "notfound@notfound.com",
      password: "123123123",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email is incorrect ,Please try again");
  });
  it("user entered incorrect password", async () => {
    let newUser = await createNewUser();
    const response = await request.post("/users/auth/signin").send({
      email: "a@a.com",
      password: "incorrectpassword",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Password is incorrect ,Please try again"
    );
  });
  it("user didn't enter  email", async () => {
    const response = await request.post("/users/auth/signin").send({
      email: "",
      password: "incorrectpassword",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("user didn't enter password", async () => {
    const response = await request.post("/users/auth/signin").send({
      email: "a@a.com",
      password: "",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
  it("user signing out", async () => {
    const response = await request.get("/users/auth/signout");
    expect(response.headers["set-cookie"][0][6]).toBe(";");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Success");
  });
});
