const diaryModel = require("../../models/diary.model");

//middleware function to check right of client to access profile
module.exports = async function DiaryAuth(req, res, next) {
  try {
    const diaryInfor = await diaryModel.getSingle(req.query.id); //get diary want to access
    //compare user_id of this diary with log in user
    if (req.user.id !== diaryInfor.id_user) {
      return res
        .status(403)
        .send({ success: false, err_message: "access denied!! wrong user" });
    }
  } catch (error) {
    return res
      .status(403)
      .send({ success: false, err_message: "access denied!! wrong user" });
  }

  //allow to access if this diary belong to this user
  next();
};
