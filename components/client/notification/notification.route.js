const express = require("express");
const notificationController = require("./notification.controller");
const router = express.Router();

router.get("/", notificationController.getAllNotification);
router.get("/detail", notificationController.getNotificationDetail);

router.post("/set-read", notificationController.setReadNotification);
// router.post("/delete-notification", notificationController.deleteNotification);

module.exports = router;
