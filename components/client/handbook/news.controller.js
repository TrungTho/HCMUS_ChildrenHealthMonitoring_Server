const newsModel = require("../../../models/news.model");
const moment = require("moment");
const utilFuncs = require("../../../utils/util-function");
const { updateLocale } = require("moment");

module.exports = tipController = {
  getAllPost: async function (req, res) {
    try {
      const data = await newsModel.getAll();

      //send data to client
      res.send({ success: true, posts: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getPostDetail: async function (req, res) {
    try {
      const datum = await newsModel.getSingle(req.query.id);

      //send data to client
      res.send({ success: true, postDetail: datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  searchPost: async function (req, res) {
    try {
      const data = await newsModel.searchAll(req.query.searchString);
      res.send({ success: true });
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
