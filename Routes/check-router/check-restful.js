const express = require("express");
const router = express.Router();
const {
  checkCreation,
  catchValidationErrors,
} = require("../../validation/check.validation");
const { userAuthentication } = require("../user-router/middleware");
const {
  createCheck,
  getCheckById,
  getChecks,
  updatedCheckById,
  deletedCheck,
} = require("../../Models/check-model/index");
const URLMonitoring = require("../monitor/axios");
const { createCheckValidation, reqParamsValidation } = require("./middleware");

router.post(
  "/",
  userAuthentication,
  createCheckValidation,
  async (req, res) => {
    try {
      const newCheck = await createCheck(req.body);
      // URLMonitoring(url, webhook, newCheck._id, interval, timeout);
      res.status(201).json({ message: "Success", data: newCheck });
    } catch (error) {
      if (error.message) {
        res.status(400).json({ message: "Invalid Info!" });
      } else {
        res.status(500).json({ message: "Error", error });
      }
    }
  }
);
router.get("/", userAuthentication, async (req, res) => {
  try {
    const checks = await getChecks();
    if (checks.length !== 0) {
      res.status(200).json({ message: "Success", data: checks });
    } else {
      res.status(200).json({ message: "There is no Checks!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
});
router.get(
  "/:id",
  userAuthentication,
  reqParamsValidation,
  async (req, res) => {
    const checkId = req.params.id;
    try {
      const check = await getCheckById(checkId);
      res.status(200).json({ message: "Success", data: check });
    } catch (error) {
      if (error.message) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ message: "Error", error });
      }
    }
  }
);
router.put(
  "/:id",
  userAuthentication,
  reqParamsValidation,
  async (req, res) => {
    let checkId = req.params.id;
    try {
      var updatedCheck = await updatedCheckById(checkId, req.body);
      res.status(201).json({ message: "Success", data: updatedCheck });
    } catch (error) {
      if (error.message) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ message: "Error", error });
      }
    }
  }
);
router.delete(
  "/:id",
  userAuthentication,
  reqParamsValidation,
  async (req, res) => {
    let checkId = req.params.id;
    try {
      const deletedCheck = await deletedCheck(checkId);
      res.status(202).json({ message: "Success" });
    } catch (error) {
      if (error.message) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ message: "Error", error });
      }
    }
  }
);

module.exports = router;
