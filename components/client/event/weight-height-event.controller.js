const diaryWeightHeightModel = require("../../../models/diary-weight-height.model");
const moment = require("moment");
const cloudinary = require("../../../middlewares/cloudinary.mdw");
const utilFuncs = require("../../../utils/util-function");
const { updateLocale } = require("moment");

module.exports = diaryController = {
  deleteEvent: async function (req, res) {
    try {
      await diaryWeightHeightModel.setDelete(req.body.id);
      res.send({ success: true });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  getAllEvent: async function (req, res) {
    try {
      const data = await diaryWeightHeightModel.getAllByDiaryId(req.query.id);

      //sort data by date descending
      data.sort(utilFuncs.compareDesc);

      //send data to client
      res.send({ success: true, events: data });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  getEventDetail: async function (req, res) {
    try {
      const data = await diaryWeightHeightModel.getSingle(req.body.id);

      //send data to client
      res.send({ success: true, eventInfor: data });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  newEvent: async function (req, res) {
    try {
      let fileUploaded = [],
        uploadResponse = { url: "" };
      if (req.files) {
        fileUploaded = req.files.uploadImg;

        //upload file to cloudinary
        uploadResponse = await cloudinary.uploader.upload(
          fileUploaded.tempFilePath,
          {
            upload_preset: process.env.CLOUD_DIARY_WEIGHT_HEIGHT_PRESET, //choose configed preset to store image
          }
        );
      }

      console.log(uploadResponse.url);

      //create new event according to user input
      const newEvent = {
        id_diary: req.query.id, //id of log in account
        weight: req.body.weight,
        height: req.body.height,
        log_date: moment(req.body.log_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        note: req.body.note,
        image: uploadResponse.url,
        isDel: 0,
      };

      //add new diary to db
      const ret = await diaryWeightHeightModel.add(newEvent);

      const datum = await diaryWeightHeightModel.getSingle(ret.insertId);

      //send success message to client
      res.send({ success: true, eventInfor: datum });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  updateEvent: async function (req, res) {
    try {
      const fileUploaded = req.files.uploadImg;
      //upload file to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(
        fileUploaded.tempFilePath,
        {
          upload_preset: process.env.CLOUD_DIARY_WEIGHT_HEIGHT_PRESET, //choose configed preset to store image
        }
      );

      //create new event according to user input
      const updatedEvent = {
        id: req.body.id, //id of event
        weight: req.body.weight,
        height: req.body.height,
        log_date: moment(req.body.log_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        note: req.body.note,
        image: uploadResponse.url || "",
        id_diary: req.query.id, //id of log in account
      };

      //add new diary to db
      await diaryWeightHeightModel.update(updatedEvent);

      const datum = await diaryWeightHeightModel.getSingle(req.body.id);

      //send success message to client
      res.send({ success: true, eventInfor: datum });
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
