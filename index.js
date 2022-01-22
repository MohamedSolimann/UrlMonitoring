const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("config");
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/user-router/user-restful");
const userAuthRouter = require("./Routes/user-router/index");

//Routes
app.use(express.json());
app.use(cookieParser());
app.use("/users", userRouter);
app.use("/users/auth", userAuthRouter);
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
