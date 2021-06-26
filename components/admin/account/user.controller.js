const bcrypt = require("bcryptjs");
const moment = require("moment");
const nodemailer = require("nodemailer");
const userModel = require("../../../models/user.model");
const cloudinary = require("../../../middlewares/cloudinary.mdw");

module.exports = userController = {
  disableUser: async function (req, res) {
    try {
      const userid = req.body.id;
      await userModel.flipDisable(userid);
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllUser: async function (req, res) {
    try {
      const data = await userModel.getAll();
      res.send({ success: true, data: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getBasisUser: async function (req, res) {
    try {
      const data = await userModel.getAllBasisUser();
      res.send({ success: true, data: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getEditor: async function (req, res) {
    try {
      const data = await userModel.getAllEditor();
      res.send({ success: true, data: data });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  registerUser: async function (req, res) {
    const checkEmail = await userModel.getSingleByEmail(req.body.mail);
    const checkUsername = await userModel.getSingleByUsername(
      req.body.username
    );

    if (checkEmail === null) {
      if (checkUsername === null) {
        try {
          const hashedPass = bcrypt.hashSync(
            req.body.password,
            parseInt(process.env.ACCOUNT_TIMEHASHPASS)
          );
          const convertedDOB = moment(req.body.dob, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          );

          const newUser = {
            username: req.body.username,
            password: hashedPass,
            dob: convertedDOB,
            fullname: req.body.fullname,
            email: req.body.mail,
            permission: 2, //editor user
            isDisable: 0,
            isVerified: 0,
            authType: "local",
          };
          console.log(newUser);

          //add user data to db
          await userModel.add(newUser);

          //send email confirm
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.CONTACT_EMAIL,
              pass: process.env.EMAIL_PASSWORD,
            },
          });

          let otp = Math.random().toString(36).substring(7);

          var mailOptions = {
            from: process.env.CONTACT_EMAIL,
            to: req.body.mail,
            subject: "Children Health Monitoring confirm account",
            text: "Welcome to our editor's community. Here is your otp: " + otp,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          res.json({ success: true });
        } catch (error) {
          res.json({ success: false, err_message: error });
        }
      } else {
        res.json({ success: false, err_message: "existed username" });
      }
    } else {
      res.json({ success: false, err_message: "existed email" });
    }
  },
};
