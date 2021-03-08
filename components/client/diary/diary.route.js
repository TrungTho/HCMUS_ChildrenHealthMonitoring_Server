const express = require("express");
const diaryController = require("./diary.controller");
const userAuth = require("../../../middlewares/userDiaryAuth.mdw"); //middle to allow user access only their own diaries
const router = express.Router();

router.get("/", diaryController.getAllDiaries);

router.post("/change-avatar", userAuth, diaryController.changeDiaryAvatar);

router.get("/time-line", userAuth, diaryController.getAllRecordByTimeLine);

router.get("/profile", userAuth, diaryController.getDiaryProfile);

router.post("/new-diary", diaryController.newDiary);

module.exports = router;
