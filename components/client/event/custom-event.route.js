const express = require("express");
const customEventController = require("./custom-event.controller");
const userAuth = require("../../../middlewares/auth/user-diary-auth.mdw"); //middle to allow user access only their own diaries
const eventAuth = require("../../../middlewares/auth/custom-event-auth.mdw"); //middle to allow user access only their own diaries
const router = express.Router();

router.get("/", customEventController.getAllEvent);

router.post(
  "/detail",
  userAuth,
  eventAuth,
  customEventController.getEventDetail
);
router.post("/new-event", userAuth, customEventController.newEvent);
router.post(
  "/update-event",
  userAuth,
  eventAuth,
  customEventController.updateEvent
);
router.post(
  "/delete-event",
  userAuth,
  eventAuth,
  customEventController.deleteEvent
);

module.exports = router;
