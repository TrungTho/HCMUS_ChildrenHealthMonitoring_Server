const weightHeightStandardModel = require("../../../models/weight-height-standard.model");

module.exports = userController = {
  deleteStandard: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllStandard: async function (req, res) {
    try {
      const data = await weightHeightStandardModel.getAll();
      res.send({ success: true, standards: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getStandardDetail: async function (req, res) {
    try {
      const datum = await weightHeightStandardModel.getSingle(req.query.id);
      res.send({ success: true, standard: datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  newStandard: async function (req, res) {
    try {
      //build data from user input
      const newNoti = {
        id_from: req.user.id,
        id_to: req.body.id_dest,
        detail: req.body.detail,
        sendDate: new Date(),
        isRead: 0,
        isDel: 0,
        username_from: req.user.username,
      };

      //add data to db
      const ret = await standardModel.add(newNoti);

      //get datum just added in db to client
      const datum = await standardModel.getSingle(ret.insertId);

      res.send({ success: true, standard: datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  updateStandard: async function (req, res) {
    try {
      await standardModel.setDelete(req.body.id);
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
