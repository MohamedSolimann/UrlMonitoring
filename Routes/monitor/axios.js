const axios = require("axios");
const { createReport } = require("../report-router/index");
const { getCheckStatus } = require("../check-router/index");
const sendEmail = require("../../verify/email-verification");
let totalNumberOfReq = 0;
let totalNumberOfSuccReq = 0;
let totalNumberOfFailReq = 0;
let uptime = 0;
let downtime = 0;
let totalDowntime = 0;
let totalUptime = 0;
let responseTime = [];
let averageResponseTime = 0;
let threshold = 0;
let downTimeDate,
  upTimeDate,
  timeWhenReqSent,
  timeWhenResRecieved,
  reqStatus,
  averageAvaiablilty;
const URLMonitoring = (url, webhook, checkId) => {
  let monitoring = setInterval(async () => {
    const checkStatus = await getCheckStatus(checkId);
    if (checkStatus === "Active") {
      monitor(url, webhook);
    } else {
      clearInterval(monitoring);
    }
  }, 5000);
};
const monitor = (url, webhook) => {
  timeWhenReqSent = new Date();
  totalNumberOfReq++;
  axios
    .get(url, { timeout: 3000 })
    .then((res) => {
      //succ request
      requestSuccess(url, webhook);
      console.log("succ req");
    })
    .catch((error) => {
      let errorCode = error.code;
      if (errorCode) {
        //failed request
        requestFailed(url, webhook);
        console.log("failed req");
      } else {
        //succu req
        requestSuccess(url, webhook);
        console.log("succ req");
      }
    });
};
const requestSuccess = (url, webhook) => {
  threshold = 0;
  totalNumberOfSuccReq++;
  timeWhenResRecieved = new Date();
  responseTime.push(
    differenceBetweenDate(timeWhenReqSent, timeWhenResRecieved, "milliseconds")
  );
  averageResponseTime = getAverage(responseTime);
  averageAvaiablilty = (totalNumberOfSuccReq / totalNumberOfReq) * 100 + "%";
  if (reqStatus !== "success" || totalNumberOfReq === 0) {
    upTimeDate = new Date();
    console.log("send email on up ");
    sendPostRequset(webhook, { Message: "Server is up" });
    sendEmail({
      to: "masoliman28@gmail.com", // Change to your recipient
      from: "ahmdsolmn@gmail.com", // Change to your verified sender
      subject: "Server is Up",
      text: "Server is Up ,Please check it!",
      html: "<body><p> Server is Up ,Please check it!</p></body>",
    });
  } else {
    totalDowntime = downtime;
    uptime =
      differenceBetweenDate(upTimeDate, new Date(), "seconds") + totalUptime;
  }
  createReport(
    url,
    "success",
    averageAvaiablilty,
    totalNumberOfFailReq,
    downtime,
    uptime,
    averageResponseTime,
    new Date()
  );
  reqStatus = "success";
};
const requestFailed = (url, webhook) => {
  totalNumberOfFailReq++;
  responseTime.push(3);
  averageResponseTime = getAverage(responseTime);
  averageAvaiablilty = (totalNumberOfSuccReq / totalNumberOfReq) * 100 + "%";
  threshold++;
  if (threshold >= 3) {
    console.log("threshold do something ");
    threshold = 0;
  }
  if (reqStatus !== "fail" || totalNumberOfFailReq === 0) {
    downTimeDate = new Date();
    sendEmail({
      to: "masoliman28@gmail.com", // Change to your recipient
      from: "ahmdsolmn@gmail.com", // Change to your verified sender
      subject: "Server is Down",
      text: "Server is Down ,Please check it!",
      html: "<body><p> Server is Down ,Please check it!</p></body>",
    });
    sendPostRequset(webhook, { Message: "Server is down" });
    console.log("send email on down ");
  } else {
    downtime =
      differenceBetweenDate(downTimeDate, new Date(), "seconds") +
      totalDowntime;
    totalUptime = uptime;
  }
  createReport(
    url,
    "failed",
    averageAvaiablilty,
    totalNumberOfFailReq,
    downtime,
    uptime,
    averageResponseTime,
    new Date()
  );
  reqStatus = "fail";
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
const differenceBetweenDate = (startDate, endDate, type) => {
  let totalNumberOfSeconds = 0;
  if (type === "seconds") {
    totalNumberOfSeconds = (endDate - startDate) / 1000;
  } else if (type === "milliseconds") {
    totalNumberOfSeconds = endDate - startDate;
  }
  return totalNumberOfSeconds;
};
const sendPostRequset = (url, body) => {
  axios
    .post(url, body, { timeout: 5000 })
    .then(() => {
      console.log("post request sent");
    })
    .catch((error) => {
      console.log("request failed please check url");
    });
};
module.exports = URLMonitoring;
