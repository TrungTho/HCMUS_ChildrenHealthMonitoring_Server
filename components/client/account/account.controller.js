const bcrypt = require("bcryptjs");
const moment = require("moment");
const multer = require("multer");
const nodemailer = require("nodemailer");
const userModel = require("../../../models/user.model");

module.exports = accountController = {
  register: async function (req, res) {
    try {
      const hashedPass = bcrypt.hashSync(
        req.body.password,
        parseInt(process.env.ACCOUNT_TIMEHASHPASS)
      );
      //const hashedPass = req.body.password;
      const convertedDOB = moment(req.body.dob, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      const newUser = {
        username: req.body.username,
        password: hashedPass,
        dob: convertedDOB,
        fullname: req.body.fullname,
        email: req.body.mail,
        permission: 0, //normal user
        isDisable: 0,
        isVerified: 0,
      };
      console.log(newUser);

      //add user data to db
      await userModel.add(newUser);

      // //send email confirm
      // var transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     user: "cloneemail1104@gmail.com",
      //     pass: "contact1104",
      //   },
      // });

      // let otp = Math.random().toString(36).substring(7);

      // var mailOptions = {
      //   from: "cloneemail1104@gmail.com",
      //   to: req.body.EMAIL,
      //   subject: "Youdemu confirm account",
      //   text: "You just created new account on Youdemu! Your OTP is: " + otp,
      // };

      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("Email sent: " + info.response);
      //   }
      // });

      res.json(true);
    } catch (error) {
      res.json(false);
    }
  },
};
