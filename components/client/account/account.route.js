const express = require("express");
const accountController = require("./account.controller");
const passport = require("../../../middlewares/passport.mdw");
const router = express.Router();

router.post(
  "/change-avatar",
  passport.authenticate("jwt", { session: false }),
  accountController.changeAvatar
);

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

router.get("/verify-account", accountController.verifyAccount);

router.post("/request-change-password", accountController.requestChangePass);

module.exports = router;
