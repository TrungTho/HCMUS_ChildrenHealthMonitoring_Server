const teethDiaryModel = require("../../models/diary-teeth.model");

//middleware function to check right of client to access event
//user req has id_diary in req.param.id & id of event in req.body.id
//so we will check those id is belong to each other or not
module.exports = async function DiaryAuth(req, res, next) {
  try {
    const eventIdDiary = await teethDiaryModel.getIdDiary(req.body.id);
    //compare user_id of this diary with log in user
    if (parseInt(req.query.id) !== eventIdDiary) {
      return res.status(403).send({
        success: false,
        err_message: "invalid request3",
      });
    }
  } catch (error) {
    return res
      .status(403)
      .send({ success: false, err_message: "invalid request" });
  }

  //allow to access if this event belong to this diary
  next();
};
