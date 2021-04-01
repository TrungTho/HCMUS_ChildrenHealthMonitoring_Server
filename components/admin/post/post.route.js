const express = require("express");
const postController = require("./post.controller");
const router = express.Router();

router.get("/", postController.getAllPost);
router.get("/tip", postController.getTipPost);
router.get("/news", postController.getVaccinePost);
router.get("/recipe", postController.getRecipePost);

router.post("/approve-post", postController.approvePost);

module.exports = router;
