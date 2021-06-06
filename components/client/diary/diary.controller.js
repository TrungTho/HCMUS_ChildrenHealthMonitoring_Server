const diaryModel = require("../../../models/diary.model");
const diaryVaccineModel = require("../../../models/diary-vaccine.model");
const diaryWeightHeightModel = require("../../../models/diary-weight-height.model");
const diaryTeethModel = require("../../../models/diary-teeth.model");
const moment = require("moment");
const cloudinary = require("../../../middlewares/cloudinary.mdw");
const utilFuncs = require("../../../utils/util-function");
const diaryCustomModel = require("../../../models/diary-custom.model");

module.exports = diaryController = {
  changeDefaultNotification: async function (req, res) {
    try {
      await diaryModel.flipDefaultMailing(req.query.id);
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

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

        // console.log("uploadResponse ", uploadResponse);

        //update avatar link in db
        await diaryModel.setAvatar(req.query.id, uploadResponse.url);

        res.send({
          success: true,
          url: uploadResponse.url,
        });
      }
    } catch (error) {
      res
        .status(406)
        .send({ success: false, err_message: error || "null image" });
    }
  },

  deleteDiary: async function (req, res) {
    try {
      //set delete diary in db
      await diaryModel.setDelete(req.query.id);

      //set all event of this diary deleted in db
      //vaccine events
      const vaccine_diaries = await diaryVaccineModel.getAllByDiaryId(
        req.query.id
      );
      vaccine_diaries.forEach(async (element) => {
        await diaryVaccineModel.setDelete(element.id);
      });

      //weight&height events
      const w_h_diaries = await diaryWeightHeightModel.getAllByDiaryId(
        req.query.id
      );
      w_h_diaries.forEach(async (element) => {
        await diaryWeightHeightModel.setDelete(element.id);
      });

      //teeth events
      const teeth_diaries = await diaryTeethModel.getAllByDiaryId(req.query.id);
      teeth_diaries.forEach(async (element) => {
        await diaryTeethModel.setDelete(element.id);
      });

      //custom event
      const custom_diaries = await diaryCustomModel.getAllByDiaryId(
        req.query.id
      );
      custom_diaries.forEach(async (element) => {
        await diaryCustomModel.setDelete(element.id);
      });

      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllDiaries: async function (req, res) {
    try {
      const data = await diaryModel.getAllByUserId(req.user.id);

      //format date base data for client's usage
      data.forEach((element) => {
        element.createdate = moment(element.createdate, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        );
        element.dob = moment(element.dob, "YYYY-MM-DD").format("DD/MM/YYYY");
      });

      res.send({ success: true, diaries: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllEventByTimeLine: async function (req, res) {
    try {
      const filterField = req.query.filter.split("-");

      // console.log(filterField);
      // console.log(req.query.isAscending);
      // console.log("year", req.query.year);

      let vaccine_diaries = [];
      if (filterField.findIndex((filter) => filter === "vaccine") !== -1) {
        vaccine_diaries = await diaryVaccineModel.getAllByDiaryId(
          req.query.id,
          parseInt(req.query.year)
        );
      }

      let w_h_diaries = [];
      if (filterField.findIndex((filter) => filter === "wh") !== -1) {
        w_h_diaries = await diaryWeightHeightModel.getAllByDiaryId(
          req.query.id,
          req.query.year
        );
      }

      let teeth_diaries = [];
      if (filterField.findIndex((filter) => filter === "teeth") !== -1) {
        teeth_diaries = await diaryTeethModel.getAllByDiaryId(
          req.query.id,
          req.query.year
        );
      }

      let custom_diaries = [];
      if (filterField.findIndex((filter) => filter === "custom") !== -1) {
        custom_diaries = await diaryCustomModel.getAllByDiaryId(
          req.query.id,
          req.query.year
        );
      }

      //join 3 arrays to one
      let dataDiaries = vaccine_diaries
        .concat(w_h_diaries)
        .concat(teeth_diaries)
        .concat(custom_diaries);

      //sort data
      if (req.query.isAscending === "true") {
        dataDiaries.sort(utilFuncs.compareAsc);
      } else {
        dataDiaries.sort(utilFuncs.compareDesc); //sort descending
      }

      //format log_date for client's usage
      dataDiaries.forEach((element) => {
        element.log_date = moment(element.log_date, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        );
      });

      res.send({
        success: true,
        dataDiaries,
      });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getDiaryProfile: async function (req, res) {
    try {
      //get datum from db
      const datum = await diaryModel.getSingle(req.query.id);

      //format log_date for client's usage
      datum.createdate = moment(datum.createdate, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );
      datum.dob = moment(datum.dob, "YYYY-MM-DD").format("DD/MM/YYYY");

      res.send({ success: true, diaryInfor: datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
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
        createdate: moment(
          await utilFuncs.getCurrentDate(),
          "YYYY-MM-DD"
        ).format("YYYY-MM-DD"),
        avatar: "",
      };

      //add new diary to db
      await diaryModel.add(newDiary);

      //format log_date for client's usage
      newDiary.createdate = moment(newDiary.createdate, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );
      newDiary.dob = req.body.dob;

      //send success message to client
      res.send({ success: true, diaryInfor: newDiary });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
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

      //format date base data for client's usage
      datum.createdate = moment(datum.createdate, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );
      datum.dob = moment(datum.dob, "YYYY-MM-DD").format("DD/MM/YYYY");

      //send data to client
      res.send({ success: true, diaryInfor: datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  template: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },
};
