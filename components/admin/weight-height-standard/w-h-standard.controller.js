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
      const newItem = {
        month: req.body.month,
        gender: req.body.gender,
        type: req.body.type,
        lower_point: req.body.lower_point,
        upper_point: req.body.upper_point,
        average_point: req.body.average_point,
      };

      //add data to db
      const ret = await weightHeightStandardModel.add(newItem);

      //get datum just added in db to client
      const datum = await weightHeightStandardModel.getSingle(ret.insertId);

      res.send({ success: true, standard: datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  updateStandard: async function (req, res) {
    try {
      //build data from user input
      const updateItem = {
        id: req.body.id,
        month: req.body.month,
        gender: req.body.gender,
        type: req.body.type,
        lower_point: req.body.lower_point,
        upper_point: req.body.upper_point,
        average_point: req.body.average_point,
      };

      //add data to db
      await weightHeightStandardModel.update(updateItem);

      res.send({ success: true, standard: updateItem });
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
