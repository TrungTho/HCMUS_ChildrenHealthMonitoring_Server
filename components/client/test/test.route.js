const express = require("express");
const testController = require("./test.controller");
const router = express.Router();

router.get("/", testController.testFullText);

router.get("/connection", testController.logConnectionStats);

router.post("/manual-mail", testController.manualMail);

// router.get("/schedule-task", testController.scheduleSendThing);

router.post("/test1", testController.test1);
router.post("/test2", testController.test2);

module.exports = router;
