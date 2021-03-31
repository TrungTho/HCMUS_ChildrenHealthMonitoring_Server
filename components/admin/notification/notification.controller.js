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
      const ret = await notificationModel.add(newNoti);

      //get datum just added in db to client
      const datum = await notificationModel.getSingle(ret.insertId);

      res.send({ success: true, notification: datum });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  deleteNotification: async function (req, res) {
    try {
      await notificationModel.setDelete(req.body.id);
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
