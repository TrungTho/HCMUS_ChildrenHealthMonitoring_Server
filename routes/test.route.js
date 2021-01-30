const express = require("express");
const diaryModel = require("../models/diary.model");
const lullabyModel = require("../models/lullaby.model");
const newsModel = require("../models/news.model");
const recipeModel = require("../models/recipe.model");
const router = express.Router();

router.get("/", async function (req, res) {
  const query = req.query.a;
  const ret = await recipeModel.searchAll(query);
  res.send(ret);
});

router.get("/connection", async function (req, res) {
  res.send("ok!!! :)");
});

module.exports = router;
