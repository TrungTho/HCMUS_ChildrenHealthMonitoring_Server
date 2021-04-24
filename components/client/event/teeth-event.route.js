const express = require("express");
const teethEventController = require("./teeth-event.controller");
const userAuth = require("../../../middlewares/auth/user-diary-auth.mdw"); //middle to allow user access only their own diaries
const eventAuth = require("../../../middlewares/auth/teeth-event-auth.mdw"); //middle to allow user access only their own diaries
const router = express.Router();

router.get("/", teethEventController.getAllEvent);

router.get("/currentTeeth", teethEventController.getCurrentTeeth);

router.post(
  "/detail",
  userAuth,
  eventAuth,
  teethEventController.getEventDetail
);
router.post("/new-event", userAuth, teethEventController.newEvent);
router.post(
  "/update-event",
  userAuth,
  eventAuth,
  teethEventController.updateEvent
);
router.post(
  "/delete-event",
  userAuth,
  eventAuth,
  teethEventController.deleteEvent
);

module.exports = router;
