const express = require("express");
const vaccineEventController = require("./vaccine-event.controller");
const userAuth = require("../../../middlewares/auth/user-diary-auth.mdw"); //middle to allow user access only their own diaries
const eventAuth = require("../../../middlewares/auth/vaccine-event-auth.mdw"); //middle to allow user access only their own diaries
const router = express.Router();

router.get("/", vaccineEventController.getAllEvent);

router.post(
  "/detail",
  userAuth,
  eventAuth,
  vaccineEventController.getEventDetail
);
router.post("/new-event", userAuth, vaccineEventController.newEvent);
router.post(
  "/update-event",
  userAuth,
  eventAuth,
  vaccineEventController.updateEvent
);
router.post(
  "/delete-event",
  userAuth,
  eventAuth,
  vaccineEventController.deleteEvent
);

module.exports = router;
