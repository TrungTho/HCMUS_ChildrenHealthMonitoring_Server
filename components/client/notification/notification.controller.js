const notificationModel = require("../../../models/notification.model");

module.exports = userController = {
  deleteNotification: async function (req, res) {
    try {
      await notificationModel.setDelete(req.body.id);
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllNotification: async function (req, res) {
    try {
      //get data from db
      const data = await notificationModel.getAllByDestinationId(req.user.id);

      //send to client
      res.send({ success: true, notifications: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getNotificationDetail: async function (req, res) {
    try {
      //get data from db
      const datum = await notificationModel.getSingle(req.query.id);

      //send to client
      res.send({ success: true, notification: datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  setReadNotification: async function (req, res) {
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
