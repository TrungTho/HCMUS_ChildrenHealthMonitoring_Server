const express = require("express");
const newsController = require("./news.controller");
const router = express.Router();

router.get("/", newsController.getAllPost);
router.get("/detail", newsController.getPostDetail);
router.get("/search", newsController.searchPost);

module.exports = router;
