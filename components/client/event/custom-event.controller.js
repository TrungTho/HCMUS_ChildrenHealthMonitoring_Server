const diaryCustomModel = require("../../../models/diairy-custom.model");
const moment = require("moment");
const cloudinary = require("../../../middlewares/cloudinary.mdw");
const utilFuncs = require("../../../utils/util-function");
const { updateLocale } = require("moment");

module.exports = diaryController = {
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

};
