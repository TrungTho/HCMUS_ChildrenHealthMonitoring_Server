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
      res.send({ success: false, err_message: error });
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
      res.send({ success: false, err_message: error });
    }
  },

  getEventDetail: async function (req, res) {
    try {
      const data = await diaryTeethModel.getSingle(req.body.id);

      //send data to client
      res.send({ success: true, eventInfor: data });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

