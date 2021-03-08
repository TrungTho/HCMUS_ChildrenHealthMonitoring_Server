const diaryModel = require("../../../models/diary.model");
const diaryVaccineModel = require("../../../models/diary-vaccine.model");
const diaryWeightHeightModel = require("../../../models/diary-weight-height.model");
const diairyTeethModel = require("../../../models/diairy-teeth.model");
const moment = require("moment");

//function to generate the current date in db's format
const getCurrentDate = () => {
  var today = new Date();
  return (
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  );
};

module.exports = diaryController = {
  getAllDiaries: async function (req, res) {
    try {
      const data = await diaryModel.getAllByUserId(req.user.id);
      res.send({ success: true, diaries: data });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  newDiary: async function (req, res) {
    try {
      //create new diary according to user input
      const newDiary = {
        id_user: req.user.id, //id of log in account
        fullname: req.body.fullname,
        gender: req.body.gender,
        dob: moment(req.body.dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
        createdate: moment(getCurrentDate(), "YYYY-MM-DD").format("YYYY-MM-DD"),
        avatar: "",
      };

      //add new diary to db
      await diaryModel.add(newDiary);

      //send success message to client
      res.send({ success: true, diaryInfor: newDiary });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },
};
