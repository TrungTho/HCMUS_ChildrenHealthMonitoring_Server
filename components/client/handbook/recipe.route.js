const express = require("express");
const recipeController = require("./recipe.controller");
const router = express.Router();

router.get("/", recipeController.getAllPost);
router.get("/detail", recipeController.getPostDetail);
router.get("/search", recipeController.searchPost);

module.exports = router;
