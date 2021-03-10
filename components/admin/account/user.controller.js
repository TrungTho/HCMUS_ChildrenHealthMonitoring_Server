const bcrypt = require("bcryptjs");
const moment = require("moment");
const nodemailer = require("nodemailer");
const userModel = require("../../../models/user.model");
const cloudinary = require("../../../middlewares/cloudinary.mdw");

module.exports = accountController = {
  disableUser: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  getAllUser: async function (req, res) {
    try {
      const data = await userModel.getAll();
      res.send({ success: true, data: data });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  getBasisUser: async function (req, res) {
    try {
      const data = await userModel.getAllBasisUser();
      res.send({ success: true, data: data });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  getEditor: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },

  registerUser: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      res.send({ success: false, err_message: error });
    }
  },
};
