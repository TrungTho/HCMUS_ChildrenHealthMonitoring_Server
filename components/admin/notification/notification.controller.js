const notificationModel = require("../../../models/notification.model");

module.exports = userController = {
  getAllNotification: async function (req, res) {
    try {
      const data = await notificationModel.getAll();
      res.send({ success: true, notifications: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  sendNotification: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  deleteNotification: async function (req, res) {
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
