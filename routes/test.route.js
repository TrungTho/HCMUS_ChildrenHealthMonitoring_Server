const express = require("express");
const diaryModel = require("../models/diary.model");
const lullabyModel = require("../models/lullaby.model");
const newsModel = require("../models/news.model");
const recipeModel = require("../models/recipe.model");
const vaccineModel = require("../models/vaccine.model");
const router = express.Router();

router.get("/", async function (req, res) {
  const query = req.query.a;
  const ret = await vaccineModel.searchAll(query);
  res.send(ret);
});

router.get("/connection", async function (req, res) {
  const item = {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
  console.log(item);
  res.send(item);
});

module.exports = router;
