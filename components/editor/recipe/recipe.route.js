const express = require("express");
const recipeController = require("./recipe.controller");
const editorPostAuth = require("../../../middlewares/auth/editor-post-auth.mdw");
const router = express.Router();

router.get("/my-post", recipeController.getAllPost);

router.post("/new-post", recipeController.newPost);
router.post("/update-post", editorPostAuth, recipeController.updatePost);
// router.post("/delete-post", editorPostAuth, tipController.deletePost);

module.exports = router;
