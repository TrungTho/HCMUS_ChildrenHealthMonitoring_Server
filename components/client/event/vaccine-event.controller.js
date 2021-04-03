const diaryVaccineModel = require("../../../models/diary-vaccine.model");
const moment = require("moment");
const utilFuncs = require("../../../utils/util-function");
const { updateLocale } = require("moment");
const inoculateModel = require("../../../models/inoculate.model");
const vaccineModel = require("../../../models/vaccine.model");

module.exports = vaccineDiaryController = {
  deleteEvent: async function (req, res) {
    try {
      await diaryVaccineModel.setDelete(req.body.id);
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllEvent: async function (req, res) {
    try {
      const data = await diaryVaccineModel.getAllByDiaryId(req.query.id);

      //sort data by date descending
      data.sort(utilFuncs.compareDesc);

      //format log_date for client's usage
      data.forEach((element) => {
        element.log_date = moment(element.log_date, "YYYY-MM-DD").format(
          "DD/MM/YYYY"
        );
      });

      //send data to client
      res.send({ success: true, events: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllVaccine: async function (req, res) {
    try {
      const data = await inoculateModel.getAllVaccine();
      res.send({ success: true, vaccines: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllVaccineName: async function (req, res) {
    try {
      const data = await vaccineModel.getAllVaccineName();
      res.send({ success: true, vaccines: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getEventDetail: async function (req, res) {
    try {
      const data = await diaryVaccineModel.getSingle(req.body.id);

      //format log_date for client's usage
      data.log_date = moment(data.log_date, "YYYY-MM-DD").format("DD/MM/YYYY");

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
        process.env.CLOUD_DIARY_VACCINE_TRACK_PRESET
      );

      //create new event according to user input
      const newEvent = {
        id_diary: req.query.id,
        log_date: moment(req.body.log_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        note: req.body.note,
        image: uploadResponse.url,
        vaccine: req.body.vaccine.join(", "),
        vaccineName: req.body.vaccineName.join(", "),
        doctor: req.body.doctor,
        isDel: 0,
      };

      //add new diary to db
      const ret = await diaryVaccineModel.add(newEvent);

      //get full datum back from db to check add successfully
      const datum = await diaryVaccineModel.getSingle(ret.insertId);
      datum.log_date = moment(datum.log_date, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );

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
        id_diary: req.query.id, //id of log in account
        log_date: moment(req.body.log_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        note: req.body.note,
        vaccine: req.body.vaccine.join(", "),
        vaccineName: req.body.vaccineName.join(", "),
        doctor: req.body.doctor,
      };

      //check if user want to change images or not
      if (req.body.isImageChange === "true") {
        const uploadResponse = await utilFuncs.uploadImage(
          req,
          process.env.CLOUD_DIARY_VACCINE_TRACK_PRESET
        );

        updatedEvent.image = uploadResponse.url;
      }

      //add new diary to db
      await diaryVaccineModel.update(updatedEvent);

      //get just updated datum in db to send to client
      const datum = await diaryVaccineModel.getSingle(req.body.id);

      //format log_date for client's usage
      datum.log_date = moment(datum.log_date, "YYYY-MM-DD").format(
        "DD/MM/YYYY"
      );

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
