const diaryVaccineModel = require("../../../models/diary-vaccine.model");
const moment = require("moment");
const cloudinary = require("../../../middlewares/cloudinary.mdw");
const utilFuncs = require("../../../utils/util-function");
const { updateLocale } = require("moment");

module.exports = diaryController = {
  getAllEvent: async function (req, res) {
    try {
      const data = await diaryVaccineModel.getAllByDiaryId(req.query.id);

      //sort data by date descending
      data.sort(utilFuncs.compareDesc);

      //send data to client
      res.send({ success: true, events: data });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  newEvent: async function (req, res) {
    try {
      const fileUploaded = req.files.uploadImg;
      //upload file to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(
        fileUploaded.tempFilePath,
        {
          upload_preset: process.env.CLOUD_DIARY_VACCINE_TRACK_PRESET, //choose configed preset to store image
        }
      );

      //create new event according to user input
      const newEvent = {
        id_diary: req.query.id, //id of log in account
        log_date: moment(req.body.log_date, "DD/MM/YYYY").format("YYYY-MM-DD"),
        note: req.body.note,
        image: uploadResponse.url || "",
        vaccine: req.body.vaccine,
        vaccineName: req.body.vaccineName,
        doctor: req.body.doctor,
        isDel: 0,
      };

      //add new diary to db
      const ret = await diaryVaccineModel.add(newEvent);

      //get full datum back from db to check add successfully
      const datum = await diaryVaccineModel.getSingle(ret.insertId);

      //send success message to client
      res.send({ success: true, eventInfor: datum });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

