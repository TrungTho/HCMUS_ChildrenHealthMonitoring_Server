const diaryModel = require("../models/diary.model");

//middleware function to check right of client to access profile
module.exports = async function DiaryAuth(req, res, next) {
  try {
    const diaryInfor = await diaryModel.getSingle(req.query.id); //get diary want to access
    //compare user_id of this diary with log in user
    if (req.user.id !== diaryInfor.id_user) {
      res.send({ success: false, err_message: "invalid request" });
    }
  } catch (error) {
    res.send({ success: false, err_message: "invalid request" });
  }

  //allow to access if this diary belong to this user
  next();
};
