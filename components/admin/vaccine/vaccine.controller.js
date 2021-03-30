const inoculateModel = require("../../../models/inoculate.model");
const vaccineModel = require("../../../models/vaccine.model");

module.exports = userController = {
  getAllInoculate: async function (req, res) {
    try {
      const data = await inoculateModel.getAll();
      res.send({ success: true, data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllVaccine: async function (req, res) {
    try {
      const data = await vaccineModel.getAll();
      res.send({ success: true, data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getInoculateDetail: async function (req, res) {
    try {
      const datum = await inoculateModel.getSingle(req.query.id);
      res.send({ success: true, datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getVaccineDetail: async function (req, res) {
    try {
      const datum = await vaccineModel.getSingle(req.query.id);
      res.send({ success: true, datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  newInoculate: async function (req, res) {
    try {
      //build new inoculate depends on user input
      const newItem = {
        vaccine: req.body.vaccine,
        injectionAge: req.body.injectionAge,
        loopSpan: req.body.loopSpan,
        note: req.body.note,
      };

      //add new item to db
      const ret = await inoculateModel.add(newItem);

      //get added datum to return to client
      const datum = await inoculateModel.getSingle(ret.insertId);
      res.send({ success: true, infor: datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  newVaccine: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  updateInoculate: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  updateVaccine: async function (req, res) {
    try {
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
