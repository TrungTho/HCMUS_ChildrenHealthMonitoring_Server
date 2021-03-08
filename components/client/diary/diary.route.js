const express = require("express");
const diaryController = require("./diary.controller");
const router = express.Router();

router.get("/", diaryController.getAllDiaries);

router.get("/time-line", diaryController.getDiaryByTimeLine);

router.get("/profile", diaryController.getProfile);

router.post("/new-diary", diaryController.newDiary);

module.exports = router;
