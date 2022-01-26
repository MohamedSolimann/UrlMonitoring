const https = require("https");
const http = require("http");
const sendEmail = require("../../verify/email-verification");

const sendPostRequest = (url, reqbody) => {
  const parseReqbody = JSON.stringify(reqbody);
  const req = http.request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  req.on("data", (d) => {});
  req.on("error", (e) => {});
  req.write(parseReqbody);
  req.end();
};
let totalNumberOfReq = 0;
let totalNumberOfSuccReq = 0;
let totalNumberOfFailReq = 0;
let uptime = 0;
let downtime = 0;
let totalDowntime = 0;
let totalUptime = 0;
let responseTime = [];
let averageResponseTime = 0;
let averageAvaiablilty,
  downTimeDate,
  upTimeDate,
  timeWhenReqSent,
  timeWhenResRecieved,
  status,
  reqStatus;
let x;
const URLMonitoring = (url, webhook) => {
  setInterval(() => {
    sendRequest(url, webhook);
  }, 9000);
};
const sendRequest = (url, webhook) => {
  let timeout = true;
  const req = http.request(url, (res) => {
    timeWhenReqSent = new Date();
    totalNumberOfReq++;
    status = res.statusCode;
    if (status === 201 || status === 200) {
      totalNumberOfSuccReq++;
      if (reqStatus !== "success" || totalNumberOfSuccReq === 0) {
        upTimeDate = new Date();
        console.log("send email on up ");
        sendPostRequest(webhook, {
          Message: "Server is Up",
        });
        // sendEmail({
        //   to: "masoliman28@gmail.com", // Change to your recipient
        //   from: "testersendgrid97@gmail.com", // Change to your verified sender
        //   subject: "Server is Up",
        //   text: "Server is Up ,Please check it!",
        //   html: "<body><p> Server is Up ,Please check it!</p></body>",
        // });
      }
      reqStatus = "success";
    } else {
      totalNumberOfFailReq++;
      if (reqStatus !== "fail" || totalNumberOfFailReq === 0) {
        downTimeDate = new Date();
        sendPostRequest(webhook, { Message: "Server is Down" });
        // sendEmail({
        //   to: "masoliman28@gmail.com", // Change to your recipient
        //   from: "testersendgrid97@gmail.com", // Change to your verified sender
        //   subject: "Server is Down",
        //   text: "Server is Down ,Please check it!",
        //   html: "<body><p> Server is Down ,Please check it!</p></body>",
        // });
        console.log("send email on down ");
      }
      reqStatus = "fail";
    }
    res.on("data", (d) => {
      timeout = false;
      timeWhenResRecieved = new Date();
      averageAvaiablilty =
        (totalNumberOfSuccReq / totalNumberOfReq) * 100 + "%";
      if (reqStatus === "fail") {
        downtime =
          differenceBetweenDate(downTimeDate, new Date(), "seconds") +
          totalDowntime;
        totalUptime = uptime;
      } else {
        totalDowntime = downtime;
        uptime =
          differenceBetweenDate(upTimeDate, new Date(), "seconds") +
          totalUptime;
      }
      responseTime.push(
        differenceBetweenDate(
          timeWhenReqSent,
          timeWhenResRecieved,
          "milliseconds"
        )
      );
      averageResponseTime = getAverage(responseTime);
      let record = {
        url,
        status,
        availability: averageAvaiablilty,
        outages: totalNumberOfFailReq,
        downtime,
        uptime,
        responsetime: averageResponseTime,
        history: new Date(),
      };
      sendPostRequest("http://localhost:8000/reports", record);
    });
  });
  req.on("error", (e) => {});
  setTimeout(() => {
    if (timeout) {
      status = 500;
      totalNumberOfReq++;
      totalNumberOfFailReq++;
      if (reqStatus !== "fail" || totalNumberOfFailReq === 0) {
        downTimeDate = new Date();
        downtime =
          differenceBetweenDate(downTimeDate, new Date(), "seconds") +
          totalDowntime;
        totalUptime = uptime;
        // sendEmail({
        //   to: "masoliman28@gmail.com", // Change to your recipient
        //   from: "testersendgrid97@gmail.com", // Change to your verified sender
        //   subject: "Server is Down",
        //   text: "Server is Down ,Please check it!",
        //   html: "<body><p> Server is Down ,Please check it!</p></body>",
        // });
        //send http post req on webhook
        // sendRequestToWebhook(webhook, { Message: "Server is Down" });
        console.log("send email on down ");
      } else {
        downtime =
          differenceBetweenDate(downTimeDate, new Date(), "seconds") +
          totalDowntime;
      }
      timeWhenResRecieved = new Date();
      responseTime.push(5);
      averageResponseTime = getAverage(responseTime);
      reqStatus = "fail";
      averageAvaiablilty =
        (totalNumberOfSuccReq / totalNumberOfReq) * 100 + "%";
      timeWhenResRecieved = "timeout";
      let record = {
        url,
        status,
        availability: averageAvaiablilty,
        outages: totalNumberOfFailReq,
        downtime,
        uptime,
        responsetime: averageResponseTime,
        history: new Date(),
      };
      sendPostRequest("http://localhost:8000/reports", record);
    }
  }, 8000);

  req.end();
};
const differenceBetweenDate = (startDate, endDate, type) => {
  let totalNumberOfSeconds = 0;
  if (type === "seconds") {
    totalNumberOfSeconds = (endDate - startDate) / 1000;
  } else if (type === "milliseconds") {
    totalNumberOfSeconds = endDate - startDate;
  }
  return totalNumberOfSeconds;
};

const getAverage = (arr) => {
  let average = 0;
  let total = 0;
  arr.forEach((v) => {
    total += v;
  });
  average = total / arr.length;
  return average;
};
// URLMonitoring("http://localhost:8080", "http://localhost:8080/webhook");
module.exports = URLMonitoring;
