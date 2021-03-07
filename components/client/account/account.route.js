const express = require("express");
const accountController = require("./account.controller");
const passport = require("passport");
require("../../../middlewares/passport.mdw");
const isAdmin = require("../../../middlewares/admin.mdw");
const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  accountController.login
);

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  accountController.logout
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  accountController.getProfile
);

router.post(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  accountController.updateProfile
);

router.post("/register", accountController.register);

module.exports = router;
