const express = require("express");
const tipController = require("./tip.controller");
const router = express.Router();

router.get("/", tipController.getAllPost);
router.get("/detail", tipController.getPostDetail);

module.exports = router;
