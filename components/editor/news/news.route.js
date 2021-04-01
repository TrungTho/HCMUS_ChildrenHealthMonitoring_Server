const express = require("express");
const newsController = require("./news.controller");
const editorPostAuth = require("../../../middlewares/auth/editor-post-auth.mdw");
const router = express.Router();

router.get("/my-post", newsController.getAllPost);

router.post("/new-post", newsController.newPost);
router.post("/update-post", editorPostAuth, newsController.updatePost);
// router.post("/delete-post", editorPostAuth, tipController.deletePost);

module.exports = router;
