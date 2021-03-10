const express = require("express");
const userController = require("./user.controller");
const router = express.Router();

router.get("/", userController.getAllUser);
router.get("/basis-user", userController.getBasisUser);
router.get("/editor", userController.getEditor);

router.post("/diable-user", userController.disableUser);

router.post("/register", userController.registerUser);

module.exports = router;
