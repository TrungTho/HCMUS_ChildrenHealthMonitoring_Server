const diaryWeightHeightModel = require("../models/diary-weight-height.model");

//middleware function to check right of client to access event
//user req has id_diary in req.param.id & id of event in req.body.id
//so we will check those id is belong to each other or not
module.exports = async function DiaryAuth(req, res, next) {
  try {
    const eventIdDiary = await diaryWeightHeightModel.getIdDiary(req.body.id);
    //compare user_id of this diary with log in user
    if (req.query.id !== eventIdDiary) {
      res.send({ success: false, err_message: "invalid request" });
    }
  } catch (error) {
    res.send({ success: false, err_message: "invalid request" });
  }

  //allow to access if this event belong to this diary
  next();
};
