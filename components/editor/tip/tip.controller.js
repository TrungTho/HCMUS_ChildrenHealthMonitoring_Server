const tipModel = require("../../../models/tip.model");
const moment = require("moment");
const utilFuncs = require("../../../utils/util-function");
const { updateLocale } = require("moment");

module.exports = diaryController = {
  //we will consider an option to editor del post "logically"
  //send message to admin and admin will del it in db?
  // deletePost: async function (req, res) {
  //   try {
  //     await tipModel.setDelete(req.body.id);
  //     res.send({ success: true });
  //   } catch (error) {
  //     res.status(406).send({ success: false, err_message: error });
  //   }
  // },

  getAllPost: async function (req, res) {
    try {
      const data = await tipModel.editorGetAllById(req.user.id);

      //send data to client
      res.send({ success: true, posts: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

