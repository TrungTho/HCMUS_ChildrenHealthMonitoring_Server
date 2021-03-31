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
      //build new inoculate depends on user input
      const newItem = {
        vaccineName: req.body.vaccineName,
        allocate: req.body.allocate,
        description: req.body.description,
      };

      //add new item to db
      const ret = await vaccineModel.add(newItem);

      //get added datum to return to client
      const datum = await vaccineModel.getSingle(ret.insertId);
      res.send({ success: true, vaccineInfor: datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  updateInoculate: async function (req, res) {
    try {
      //build new inoculate depends on user input
      const updateItem = {
        id: req.body.id,
        vaccine: req.body.vaccine,
        injectionAge: req.body.injectionAge,
        loopSpan: req.body.loopSpan,
        note: req.body.note,
      };

      console.log(updateItem);

      //add new item to db
      await inoculateModel.update(updateItem);

      //send datum to client
      res.send({ success: true, infor: updateItem });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  updateVaccine: async function (req, res) {
    try {
      //build new inoculate depends on user input
      const updateItem = {
        id: req.body.id,
        vaccineName: req.body.vaccineName,
        allocate: req.body.allocate,
        description: req.body.description,
      };

      //add new item to db
      await vaccineModel.update(updateItem);

      //send datum to client
      res.send({ success: true, vaccineInfor: updateItem });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  deleteInoculate: async function (req, res) {
    try {
      //delete datum in db
      const ret = await inoculateModel.del({ id: req.body.id });

      //send datum to client
      res.send({ success: true, ret });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  deleteVaccine: async function (req, res) {
    try {
      //delete datum in db
      await vaccineModel.del({ id: req.body.id });

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
