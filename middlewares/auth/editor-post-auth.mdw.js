const editorPostModel = require("../../models/editor-post.model");

//middleware function to check right of client to access profile
module.exports = async function DiaryAuth(req, res, next) {
  try {
    const userId = await editorPostModel.getEditorIdByPostId(req.query.id);
    //compare user_id of this diary with log in user
    if (req.user.id !== userId) {
      return res
        .status(403)
        .send({ success: false, err_message: "invalid request" });
    }
  } catch (error) {
    return res
      .status(403)
      .send({ success: false, err_message: "invalid request" });
  }

  //allow to access if this diary belong to this user
  next();
};
