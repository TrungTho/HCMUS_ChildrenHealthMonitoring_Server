const express = require("express");
const notificationController = require("./notification.controller");
const router = express.Router();

router.get("/", notificationController.getAllNotification);

router.post("/send-notification", notificationController.sendNotification);
router.post("/delete-notification", notificationController.deleteNotification);

module.exports = router;
