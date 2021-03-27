const express = require("express");
const testController = require("./test.controller");
const router = express.Router();

router.get("/", testController.testFullText);

router.get("/connection", testController.logConnectionStats);

router.post("/manual-mail", testController.manualMail);

// router.get("/schedule-task", testController.scheduleSendThing);

module.exports = router;
