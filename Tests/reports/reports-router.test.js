const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);
const mongoose = require("mongoose");
const { createNewReport, deleteReport } = require("./index");
const { setupDB } = require("../testDBSetup");
const { userSignIn, createNewUser } = require("../users/index");
setupDB();

const readEndpointTestCases = () => {
  it("Suppose to get report by id", async () => {
    let newUser = await createNewUser();
    let verified = await verifyUser();
    let token = await userSignIn();
    let newReport = await createNewReport();
    const response = await request
      .get(`/reports/${newReport._id}`)
      .set("Cookie", token);
    expect(response.status).toBe(200);
    expect(response.body.data.url).toBe("localhost:8080/");
    expect(response.body.data.status).toBe(200);
    expect(response.body.data.availability).toBe("100%");
    expect(response.body.data.outages).toBe(0);
    expect(response.body.data.downtime).toBe(0);
    expect(response.body.data.uptime).toBe(1);
    expect(response.body.data.responsetime).toBe(1);
    expect(response.body.data.history).toBe("2022-01-24T17:18:18.000Z");
  });
  it("Suppose to get error invalid report id ", async () => {
    let newUser = await createNewUser();
    let verified = await verifyUser();
    let token = await userSignIn();
    let reportId = "Invalid report id";
    const response = await request
      .get(`/reports/${reportId}`)
      .set("Cookie", token);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please check the report id");
  });
  it("Suppose to get error report no longer exists ", async () => {
    let newUser = await createNewUser();
    let verified = await verifyUser();
    let token = await userSignIn();
    let newReport = await createNewReport();
    await deleteReport(newReport._id, token);
    const response = await request
      .get(`/reports/${newReport._id}`)
      .set("Cookie", token);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Report no longer exists!");
  });
  it("Suppose to get all reports ", async () => {
    let newUser = await createNewUser();
    let verified = await verifyUser();
    let token = await userSignIn();
    let newReport = await createNewReport();
    const response = await request.get("/reports").set("Cookie", token);
    const responseData = response.body.data;
    expect(response.status).toBe(200);
    expect(responseData[responseData.length - 1].url).toBe("localhost:8080/");
    expect(responseData[responseData.length - 1]._id).toBe(newReport._id);
    expect(responseData[responseData.length - 1].status).toBe(200);
    expect(responseData[responseData.length - 1].availability).toBe("100%");
    expect(responseData[responseData.length - 1].outages).toBe(0);
    expect(responseData[responseData.length - 1].downtime).toBe(0);
    expect(responseData[responseData.length - 1].uptime).toBe(1);
    expect(responseData[responseData.length - 1].responsetime).toBe(1);
    expect(responseData[responseData.length - 1].history).toBe(
      "2022-01-24T17:18:18.000Z"
    );
  });
};

const restApiTestCases = () => {
  readEndpointTestCases();
};
describe("Testing Restful API for reports", restApiTestCases);
