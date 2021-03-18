const diaryCustomModel = require("../../../models/diairy-custom.model");
const moment = require("moment");
const utilFuncs = require("../../../utils/util-function");
const { updateLocale } = require("moment");

module.exports = diaryController = {
  deleteEvent: async function (req, res) {
    try {
      await diaryCustomModel.setDelete(req.body.id);
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllEvent: async function (req, res) {
    try {
      const data = await diaryCustomModel.getAllByDiaryId(req.query.id);

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
      const data = await diaryCustomModel.getSingle(req.body.id);

      //send data to client
      res.send({ success: true, eventInfor: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  newEvent: async function (req, res) {
    try {
      //call global function to upload image and return url if existed
      const uploadResponse = await utilFuncs.uploadImage(
        req,
        process.env.CLOUD_CUSTOM_PRESET
      );

      //create new event according to user input
      const newEvent = {
        id_diary: req.query.id,
        log_date: moment(req.body.log_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        note: req.body.note,
        image: uploadResponse.url,
        isDel: 0,
      };

      //add new diary to db
      const ret = await diaryCustomModel.add(newEvent);

      //get full datum back from db to check add successfully
      const datum = await diaryCustomModel.getSingle(ret.insertId);

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
        note: req.body.note,
        isDel: 0,
      };

      //check if user want to change images or not
      if (req.body.isImageChange === "true") {
        const uploadResponse = await utilFuncs.uploadImage(
          req,
          process.env.CLOUD_CUSTOM_PRESET
        );

        updatedEvent.image = uploadResponse.url;
      }

      //add new diary to db
      await diaryCustomModel.update(updatedEvent);

      const datum = await diaryCustomModel.getSingle(req.body.id);

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
