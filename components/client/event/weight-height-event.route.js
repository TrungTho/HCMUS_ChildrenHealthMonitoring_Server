const express = require("express");
const weightHeightController = require("./weight-height-event.controller");
const userAuth = require("../../../middlewares/userDiaryAuth.mdw"); //middle to allow user access only their own diaries
const router = express.Router();

router.get("/", weightHeightController.getAllEvent);

router.post("/new-event", weightHeightController.newEvent);
router.post("/update-event", weightHeightController.updateEvent);
router.post("/delete-event", weightHeightController.deleteEvent);

module.exports = router;
