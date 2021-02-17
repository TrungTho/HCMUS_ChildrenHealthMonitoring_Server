const express = require("express");
const accountController = require("./account.controller");
const router = express.Router();

router.post("/register", accountController.register);

module.exports = router;
