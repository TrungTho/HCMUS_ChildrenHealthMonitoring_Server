const express = require("express");
const weightHeightController = require("./weight-height-event.controller");
const userAuth = require("../../../middlewares/userDiaryAuth.mdw"); //middle to allow user access only their own diaries
const router = express.Router();

router.get("/", weightHeightController.getAllEvent);

router.post("/new-event", userAuth, weightHeightController.newEvent);
router.post("/update-event", userAuth, weightHeightController.updateEvent);
router.post("/delete-event", userAuth, weightHeightController.deleteEvent);

module.exports = router;
