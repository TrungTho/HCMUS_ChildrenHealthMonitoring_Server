const express = require("express");
const vaccineController = require("./vaccine-event.controller");
const userAuth = require("../../../middlewares/userDiaryAuth.mdw"); //middle to allow user access only their own diaries
const eventAuth = require("../../../middlewares/weight-height-event-auth.mdw"); //middle to allow user access only their own diaries
const router = express.Router();

router.get("/", vaccineController.getAllEvent);

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
