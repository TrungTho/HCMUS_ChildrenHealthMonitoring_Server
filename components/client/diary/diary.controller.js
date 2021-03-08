const diaryModel = require("../../../models/diary.model");

module.exports = accountController = {
  newDiary: async function (req, res) {},

  getDiary: async function (req, res) {
    try {
      const data = await diaryModel.getAllByUserId(req.user.id);
      res.send({ success: true, diaries: data });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },
};
