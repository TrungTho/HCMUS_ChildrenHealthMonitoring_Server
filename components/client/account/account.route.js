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

router.get(
  "/login/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/login/google/callback",
  passport.authenticate("google", { session: false }),
  accountController.googleLogin
);


router.post("/login/google/google-from-fe", accountController.googleLoginFe);

router.post(
  "/login/facebook/facebook-from-fe",
  accountController.facebookLoginFe
);

router.get(
  "/login/facebook",
  passport.authenticate("facebook", { session: false })
);

router.get(
  "/login/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  accountController.facebookLogin
);

router.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  accountController.logout
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

router.post(
  "/change-password",
  passport.authenticate("jwt", { session: false }),
  accountController.changePasswordWhenSignedIn
);

router.post("/register", accountController.register);

router.get("/verify-account", accountController.verifyAccount);

router.post("/request-reset-password", accountController.requestChangePass);

router.post("/reset-password", accountController.changePassword);

module.exports = router;
