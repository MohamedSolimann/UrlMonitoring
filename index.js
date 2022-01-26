const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./Routes/user-router/user-restful");
const userAuthRouter = require("./Routes/user-router/user-auth");
const checkRouter = require("./Routes/check-router/check-restful");
const reportRouter = require("./Routes/report-router/report-restful");

//Routes
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/users", userRouter);
app.use("/users/auth", userAuthRouter);
app.use("/checks", checkRouter);
app.use("/reports", reportRouter);
mongoose.connect(
  `mongodb://${config.get("DB.host")}:${config.get("DB.port")}/${config.get(
    "DB.dbName"
  )}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("db connected");
  }
);

const dbConnection = mongoose.connection;

dbConnection.once("open", () => {
  app.listen(config.get("server.port"), () => {
    console.log("server is running...");
  });
});

module.exports = app;
