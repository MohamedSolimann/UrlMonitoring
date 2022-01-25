const supertest = require("supertest");
const app = require("../../index");
const request = supertest(app);

async function createNewReport() {
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
  return response.body.data;
}
async function deleteReport(reportId) {
  const reponse = await request.delete(`/reports/${reportId}`);
}

module.exports = { createNewReport, deleteReport };
