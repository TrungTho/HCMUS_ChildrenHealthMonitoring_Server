const tipModel = require("../../../models/tip.model");
const moment = require("moment");
const utilFuncs = require("../../../utils/util-function");
const { updateLocale } = require("moment");
const itemPerPage = 5;

module.exports = tipController = {
  getAllPost: async function (req, res) {
    try {
      let data, totalPages;
      if (req.query.pageNo) {
        data = await tipModel.getAllWithPaging(
          parseInt(req.query.pageNo),
          itemPerPage
        );
        // console.log("data: " + data);
        const rowNo = parseInt(await tipModel.countRows());
        // console.log("row count: ", rowNo);
        totalPages =
          Math.floor(rowNo / itemPerPage) + (rowNo % itemPerPage === 0 ? 0 : 1);
        // console.log("pages: " + totalPages);
      } else {
        data = await tipModel.getAll();
        totalPages = 0;
      }
      //send data to client
      res.send({ success: true, totalPages, posts: data });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getPostDetail: async function (req, res) {
    try {
      const datum = await tipModel.getSingle(req.query.id);

      //send data to client
      res.send({ success: true, postDetail: datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  searchPost: async function (req, res) {
    try {
      const data = await tipModel.searchAll(req.query.searchString);
      res.send({ success: true, results: data });
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
