const express = require("express");
const diaryController = require("./diary.controller");
const router = express.Router();

router.get("/", diaryController.getDiary);
router.post("/new-diary", diaryController.newDiary);

module.exports = router;
