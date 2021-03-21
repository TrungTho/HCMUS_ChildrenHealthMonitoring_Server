const express = require("express");
const tipController = require("./tip.controller");
const editorPostAuth = require("../../../middlewares/auth/editor-post-auth.mdw");
const router = express.Router();

router.get("/my-post", tipController.getAllPost);

router.post("/new-post", tipController.newPost);
router.post("/update-post", editorPostAuth, tipController.updatePost);
// router.post("/delete-post", editorPostAuth, tipController.deletePost);

module.exports = router;
