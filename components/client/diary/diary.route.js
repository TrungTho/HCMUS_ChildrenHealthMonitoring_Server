const express = require("express");
const diaryController = require("./diary.controller");
const userAuth = require("../../../middlewares/auth/user-diary-auth.mdw"); //middle to allow user access only their own diaries
const router = express.Router();

router.get("/", diaryController.getAllDiaries);

router.post("/change-avatar", userAuth, diaryController.changeDiaryAvatar);
router.post("/delete-diary", userAuth, diaryController.deleteDiary);

router.get("/time-line", userAuth, diaryController.getAllEventByTimeLine);

router.get("/profile", userAuth, diaryController.getDiaryProfile);
router.post("/profile", userAuth, diaryController.updateDiaryProfile);

router.post("/new-diary", diaryController.newDiary);

module.exports = router;
