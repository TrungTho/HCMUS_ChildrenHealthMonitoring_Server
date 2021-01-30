const express = require("express");
const diaryModel = require("../models/diary.model");
const router = express.Router();

router.get("/", async function (req, res) {
  const ret = await diaryModel.setAvatar(1, "hehehe");
  res.send(ret);
});

router.get("/connection", async function (req, res) {
  res.send("ok!!! :)");
});

module.exports = router;
