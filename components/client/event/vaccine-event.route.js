const express = require("express");
const vaccineController = require("./vaccine-event.controller");
const userAuth = require("../../../middlewares/auth/user-diary-auth.mdw"); //middle to allow user access only their own diaries
const eventAuth = require("../../../middlewares/auth/vaccine-event-auth.mdw"); //middle to allow user access only their own diaries
const router = express.Router();

router.get("/", vaccineController.getAllEvent);

router.post("/detail", userAuth, eventAuth, vaccineController.getEventDetail);
router.post("/new-event", userAuth, vaccineController.newEvent);
router.post(
  "/update-event",
  userAuth,
  eventAuth,
  vaccineController.updateEvent
);
router.post(
  "/delete-event",
  userAuth,
  eventAuth,
  vaccineController.deleteEvent
);

module.exports = router;
