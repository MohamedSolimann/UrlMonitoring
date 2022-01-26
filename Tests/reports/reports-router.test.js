const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);
const mongoose = require("mongoose");
const { createNewReport, deleteReport } = require("./index");
const { setupDB } = require("../testDBSetup");

setupDB();

const createEndpointTestCases = () => {
  it("Suppose to create new report", async () => {
    const response = await request.post("/reports").send({
      url: "localhost:8080/",
      status: 200,
      availability: "100%",
      outages: 0,
      downtime: 0,
      uptime: 1,
      responsetime: 1,
      history:
        "Mon Jan 24 2022 19:18:18 GMT+0200 (Eastern European Standard Time)",
    });
    expect(response.status).toBe(201);
    expect(response.body.data.url).toBe("localhost:8080/");
    expect(response.body.data.status).toBe(200);
    expect(response.body.data.availability).toBe("100%");
    expect(response.body.data.outages).toBe(0);
    expect(response.body.data.downtime).toBe(0);
    expect(response.body.data.uptime).toBe(1);
    expect(response.body.data.responsetime).toBe(1);
    expect(response.body.data.history).toBe("2022-01-24T17:18:18.000Z");
  });
  it("Suppose to get availability validtaion error from create endpoint", async () => {
    const response = await request.post("/reports").send({
      status: 200,
      availability: "",
      outages: 0,
      downtime: 0,
      uptime: 1,
      responsetime: 1,
      history:
        "Mon Jan 24 2022 19:18:18 GMT+0200 (Eastern European Standard Time)",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid Info!");
  });
};
const readEndpointTestCases = () => {
  it("Suppose to get report by id", async () => {
    let newReport = await createNewReport();
    console.log(newReport);
    const response = await request.get(`/reports/${newReport._id}`);
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
    let reportId = "Invalid report id";
    const response = await request.get(`/reports/${reportId}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Please check the report id");
  });
  it("Suppose to get error report no longer exists ", async () => {
    let newReport = await createNewReport();
    await deleteReport(newReport._id);
    const response = await request.get(`/reports/${newReport._id}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Report no longer exists!");
  });
  it("Suppose to get all reports ", async () => {
    let newReport = await createNewReport();
    const response = await request.get("/reports");
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
const udpateEndpointTestCases = () => {
  it("Suppose to update report ", async () => {
    let newReport = await createNewReport();
    let oldReportStatus = newReport.status;
    const response = await request
      .put(`/reports/${newReport._id}`)
      .send({ status: 201 });
    let updatedStatus = response.body.data.status;
    expect(response.status).toBe(201);
    expect(oldReportStatus).not.toEqual(updatedStatus);
    expect(response.body.data.status).toEqual(201);
  });
};
const deleteEndpointTestCases = () => {
  it("Suppose to delete report ", async () => {
    let newReport = await createNewReport();
    let reportId = newReport._id;
    let response = await request.delete(`/reports/${reportId}`);
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
describe("Testing Restful API for reports", restApiTestCases);
