const express = require("express");
const diaryController = require("./diary.controller");
const router = express.Router();

router.get("/", diaryController.getAllDiary);

module.exports = router;
