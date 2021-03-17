const diaryTeethModel = require("../../../models/diairy-teeth.model");
const moment = require("moment");
const cloudinary = require("../../../middlewares/cloudinary.mdw");
const utilFuncs = require("../../../utils/util-function");
const { updateLocale } = require("moment");

module.exports = diaryController = {
  deleteEvent: async function (req, res) {
    try {
      await diaryTeethModel.setDelete(req.body.id);
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllEvent: async function (req, res) {
    try {
      const data = await diaryTeethModel.getAllByDiaryId(req.query.id);

      //sort data by date descending
      data.sort(utilFuncs.compareDesc);

      //send data to client
      res.send({ success: true, events: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getEventDetail: async function (req, res) {
    try {
      const data = await diaryTeethModel.getSingle(req.body.id);

      //send data to client
      res.send({ success: true, eventInfor: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  newEvent: async function (req, res) {
    try {
      let fileUploaded = [],
        uploadResponse = { url: "" };

      //check if req.file is existed or not
      if (req.files) {
        fileUploaded = req.files.uploadImg;

        //upload file to cloudinary
        uploadResponse = await cloudinary.uploader.upload(
          fileUploaded.tempFilePath,
          {
            upload_preset: process.env.CLOUD_DIARY_TEETH_PRESET, //choose configed preset to store image
          }
        );
      }
      //create new event according to user input
      const newEvent = {
        id_diary: req.query.id,
        log_date: moment(req.body.log_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        numberOfTeeth: req.body.numberOfTeeth,
        note: req.body.note,
        image: uploadResponse.url,
        isDel: 0,
      };

      //add new diary to db
      const ret = await diaryTeethModel.add(newEvent);

      //get full datum back from db to check add successfully
      const datum = await diaryTeethModel.getSingle(ret.insertId);

      //send success message to client
      res.send({ success: true, eventInfor: datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  updateEvent: async function (req, res) {
    try {
      //create new event according to user input
      const updatedEvent = {
        id: req.body.id, //id of event
        id_diary: req.query.id,
        log_date: moment(req.body.log_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        numberOfTeeth: req.body.numberOfTeeth,
        note: req.body.note,
        isDel: 0,
      };

      //image update process
      let fileUploaded = [],
        uploadResponse = { url: "" };

      //check if req.file is existed or not
      if (req.body.isImageChange === "true") {
        fileUploaded = req.files.uploadImg;
        //upload file to cloudinary
        uploadResponse = await cloudinary.uploader.upload(
          fileUploaded.tempFilePath,
          {
            upload_preset: process.env.CLOUD_DIARY_TEETH_PRESET, //choose configed preset to store image
          }
        );

        updatedEvent.image = uploadResponse.url;
      }

      //add new diary to db
      await diaryTeethModel.update(updatedEvent);

      const datum = await diaryTeethModel.getSingle(req.body.id);

      //send success message to client
      res.send({ success: true, eventInfor: datum });
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
