const express = require("express");
const tipController = require("./tip.controller");
const router = express.Router();

router.get("/", tipController.getAllPost);
router.get("/detail", tipController.getPostDetail);
router.get("/search", tipController.searchPost);

module.exports = router;
