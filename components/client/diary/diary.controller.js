const diaryModel = require("../../../models/diary.model");
const diaryVaccineModel = require("../../../models/diary-vaccine.model");
const diaryWeightHeightModel = require("../../../models/diary-weight-height.model");
const diairyTeethModel = require("../../../models/diairy-teeth.model");
const moment = require("moment");
const cloudinary = require("../../../middlewares/cloudinary.mdw");
const utilFuncs = require("../../../utils/util-function");

module.exports = diaryController = {
  changeDiaryAvatar: async function (req, res) {
    try {
      const fileUploaded = req.files.uploadImg;
      //check if client sent image is null or not
      if (!fileUploaded) {
      } else {
        //upload file to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(
          fileUploaded.tempFilePath,
          {
            upload_preset: process.env.CLOUD_DIARY_PRESET, //choose configed preset to store image
          }
        );

        console.log("uploadResponse ", uploadResponse);

        //update avatar link in db
        await diaryModel.setAvatar(req.query.id, uploadResponse.url);

        res.send({
          success: true,
          url: uploadResponse.url,
        });
      }
    } catch (error) {
      res.send({ success: false, err_message: error || "null image" });
    }
  },

  getAllDiaries: async function (req, res) {
    try {
      const data = await diaryModel.getAllByUserId(req.user.id);
      res.send({ success: true, diaries: data });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  getAllEventByTimeLine: async function (req, res) {
    try {
      const vaccine_diaries = await diaryVaccineModel.getAllByDiaryId(
        req.query.id
      );

      const w_h_diaries = await diaryWeightHeightModel.getAllByDiaryId(
        req.query.id
      );

      const teeth_diaries = await diairyTeethModel.getAllByDiaryId(
        req.query.id
      );

      if (
        vaccine_diaries.length ||
        w_h_diaries.length ||
        teeth_diaries.length
      ) {
        res.send({
          success: true,
          vaccine: vaccine_diaries,
          weight_height: w_h_diaries,
          teeth: teeth_diaries,
        });
      } else {
        res.send({ success: false, err_message: "no record" });
      }
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  getDiaryProfile: async function (req, res) {
    try {
      //get datum from db
      const datum = await diaryModel.getSingle(req.query.id);

      res.send({ success: true, diaryInfor: datum });
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
        createdate: moment(utilFuncs.getCurrentDate(), "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        ),
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

  updateDiaryProfile: async function (req, res) {
    try {
      //create diary according to user input
      const updatedDiary = {
        id: req.query.id,
        id_user: req.user.id, //id of log in account
        fullname: req.body.fullname,
        gender: req.body.gender,
        dob: moment(req.body.dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
      };

      //update data in db
      await diaryModel.update(updatedDiary);

      //get updated datum to send
      const datum = await diaryModel.getSingle(req.query.id);

      res.send({ success: true, diaryInfor: datum });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  template: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },
};
