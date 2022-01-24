const https = require("https");
const http = require("http");
const sendEmail = require("../../verify/email-verification");

const options = {
  hostname: "localhost",
  port: 8080,
  path: "/",
  method: "GET",
};
const webhook = {
  hostname: "localhost",
  port: 8080,
  path: "/webhook",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};
let totalNumberOfReq = 0;
let totalNumberOfSuccReq = 0;
let totalNumberOfFailReq = 0;
let history = [];
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
setInterval(() => {
  sendRequest(options);
}, 6000);
const sendRequestToWebhook = (options, reqbody) => {
  let webhookBody = JSON.stringify(reqbody);
  const req = http.request(options, (res) => {
    res.on("data", (d) => {
      console.log(res.statusCode);
      console.log("requset sent on webhook");
    });
    res.on("error", (e) => {
      // console.log("error");
      req.end;
    });
  });
  req.write(webhookBody);
  req.end();
};
const sendRequest = (options) => {
  let timeout = true;
  history.push(new Date());
  const req = http.request(options, (res) => {
    timeWhenReqSent = new Date();
    totalNumberOfReq++;
    status = res.statusCode;
    console.log(status);
    if (status === 201 || status === 200) {
      totalNumberOfSuccReq++;
      if (reqStatus !== "success" || totalNumberOfSuccReq === 0) {
        upTimeDate = new Date();
        console.log("send email on up ");
        //send email
        //send http post req on webhook
        sendRequestToWebhook(webhook, { Message: "Server is Up" });
        sendEmail({
          to: "masoliman28@gmail.com", // Change to your recipient
          from: "testersendgrid97@gmail.com", // Change to your verified sender
          subject: "Server is Up",
          text: "Server is Up ,Please check it!",
          html: "<body><p> Server is Up ,Please check it!</p></body>",
        });
      }
      reqStatus = "success";
    } else {
      totalNumberOfFailReq++;
      if (reqStatus !== "fail" || totalNumberOfFailReq === 0) {
        downTimeDate = new Date();
        //send email
        //send http post req on webhook
        sendRequestToWebhook(webhook, { Message: "Server is Down" });
        sendEmail({
          to: "masoliman28@gmail.com", // Change to your recipient
          from: "testersendgrid97@gmail.com", // Change to your verified sender
          subject: "Server is Down",
          text: "Server is Down ,Please check it!",
          html: "<body><p> Server is Down ,Please check it!</p></body>",
        });
        console.log("send email on down ");
      }
      reqStatus = "fail";
    }
    res.on("data", (d) => {
      timeout = false;
      timeWhenResRecieved = new Date();
      console.log("status " + status);
      console.log("total number of request " + totalNumberOfReq);
      console.log("total number of succ request " + totalNumberOfSuccReq);
      console.log("total number of failed request " + totalNumberOfFailReq);
      averageAvaiablilty =
        (totalNumberOfSuccReq / totalNumberOfReq) * 100 + "%";
      console.log(averageAvaiablilty);
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

      console.log("downtime " + downTimeDate);
      console.log("uptime " + upTimeDate);
      console.log("request sent " + timeWhenReqSent);
      console.log("reponse recieved " + timeWhenResRecieved);
      responseTime.push(
        differenceBetweenDate(
          timeWhenReqSent,
          timeWhenResRecieved,
          "milliseconds"
        )
      );
      averageResponseTime = getAverage(responseTime);
      console.log("uptime " + uptime);
      console.log("downtime " + downtime);

      console.log("response time " + responseTime);
      let record = {
        status,
        availability: averageAvaiablilty,
        outages: totalNumberOfFailReq,
        downtime,
        uptime,
        responseTime: averageResponseTime,
        history,
      };
      console.log(record);
    });
  });
  req.on("error", (e) => {
    // console.log(e);
  });
  setTimeout(() => {
    if (timeout) {
      status = undefined;
      console.log("timeout");
      totalNumberOfReq++;
      totalNumberOfFailReq++;
      if (reqStatus !== "fail" || totalNumberOfFailReq === 0) {
        downTimeDate = new Date();
        downtime =
          differenceBetweenDate(downTimeDate, new Date(), "seconds") +
          totalDowntime;
        totalUptime = uptime;
        sendEmail({
          to: "masoliman28@gmail.com", // Change to your recipient
          from: "testersendgrid97@gmail.com", // Change to your verified sender
          subject: "Server is Down",
          text: "Server is Down ,Please check it!",
          html: "<body><p> Server is Down ,Please check it!</p></body>",
        });
        //send http post req on webhook
        sendRequestToWebhook(webhook, { Message: "Server is Down" });
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
      console.log("reponse recieved time" + timeWhenResRecieved);
      console.log(averageAvaiablilty);
      console.log("status " + status);
      console.log("total number of request " + totalNumberOfReq);
      console.log("total number of succ request " + totalNumberOfSuccReq);
      console.log("total number of failed request " + totalNumberOfFailReq);
      console.log("response time " + responseTime);

      let record = {
        status,
        availability: averageAvaiablilty,
        outages: totalNumberOfFailReq,
        downtime,
        uptime,
        responseTime: averageResponseTime,
        history,
      };
      console.log(record);
    }
  }, 5000);
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
