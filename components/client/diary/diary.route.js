const express = require("express");
const diaryController = require("./diary.controller");
const router = express.Router();

router.get("/", diaryController.getAllDiaries);

router.post("/change-avatar", diaryController.changeDiaryAvatar);

router.get("/time-line", diaryController.getDiaryByTimeLine);

router.get("/profile", diaryController.getDiaryProfile);

router.post("/new-diary", diaryController.newDiary);

module.exports = router;
