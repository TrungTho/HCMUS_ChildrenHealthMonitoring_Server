const express = require("express");
const weightHeightEventController = require("./weight-height-event.controller");
const userAuth = require("../../../middlewares/auth/user-diary-auth.mdw"); //middle to allow user access only their own diaries
const eventAuth = require("../../../middlewares/auth/weight-height-event-auth.mdw"); //middle to allow user access only their own diaries
const router = express.Router();

router.get("/", weightHeightEventController.getAllEvent);
router.get("/standard-params", weightHeightEventController.getStandardParam);

router.post(
  "/detail",
  userAuth,
  eventAuth,
  weightHeightEventController.getEventDetail
);
router.post("/new-event", userAuth, weightHeightEventController.newEvent);
router.post(
  "/update-event",
  userAuth,
  eventAuth,
  weightHeightEventController.updateEvent
);
router.post(
  "/delete-event",
  userAuth,
  eventAuth,
  weightHeightEventController.deleteEvent
);

module.exports = router;
