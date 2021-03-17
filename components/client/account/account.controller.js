const bcrypt = require("bcryptjs");
const moment = require("moment");
const nodemailer = require("nodemailer");
const userModel = require("../../../models/user.model");
const cloudinary = require("../../../middlewares/cloudinary.mdw");
const utilFuncs = require("../../../utils/util-function");

module.exports = accountController = {
  changeAvatar: async function (req, res) {
    try {
      let fileUploaded = [];
      if (req.files) {
        fileUploaded = req.files.uploadImg;
      }

      //check if client sent image is null or not
      if (!fileUploaded) {
      } else {
        //upload file to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(
          fileUploaded.tempFilePath,
          {
            upload_preset: process.env.CLOUD_PROFILE_PRESET, //choose configed preset to store image
          }
        );

        //update avatar link in db
        await userModel.setAvatar(req.user.id, uploadResponse.url);

        res.send({
          success: true,
          url: uploadResponse.url,
        });
      }
    } catch (error) {
      res
        .status(406)
        .send({ success: false, err_message: error || "null image" });
    }
  },

  getProfile: async function (req, res) {
    req.user.dob = moment(req.user.dob, "YYYY-MM-DD").format("DD/MM/YYYY"); //convert from db's format to user's friendly format
    res.send({ userInfor: req.user });
  },

  login: async function (req, res) {
    if (req.user == "Unauthorized") {
    } else {
      const token = utilFuncs.encodedToken(req.user.username);

      //res.setHeader("Authorization", token);
      res.cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60, //1hour
      });
      res.send({
        success: true,
        userInfor: {
          username: req.user.username,
          fullname: req.user.fullname,
          avatar: req.user.avatar,
          email: req.user.email,
        },
      });
    }
  },

  logout: async function (req, res) {
    res.clearCookie(process.env.COOKIE_NAME).send({ success: true });
  },

  updateProfile: async function (req, res) {
    //first check if user in token is user want to update profile or not?
    if (req.user.username === req.body.username) {
      try {
        //check if password is valid or not
        if (bcrypt.compareSync(req.body.password, req.user.password)) {
          const newUser = {
            id: req.user.id,
            username: req.user.username, //username cant be changed
            password: req.user.password,
            dob: moment(req.body.dob, "DD/MM/YYYY").format("YYYY-MM-DD"),
            fullname: req.body.fullname,
            email: req.body.mail,
            permission: req.user.permission,
            isDisable: req.user.isDisable,
            isVerified: req.user.isVerified,
          };

          //update user data in db
          await userModel.update(newUser);

          //send success message to client
          res.send({ success: true, userInfor: newUser });
        } else {
          res
            .status(406)
            .send({ success: false, err_message: "wrong password" });
        }
      } catch (error) {
        res.status(406).send({ success: false, err_message: error });
      }
    } else {
      res.status(406).send({ success: false, err_message: "invalid token" });
    }
  },

  register: async function (req, res) {
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
            text: "Welcome to our community. Here is your otp: " + otp,
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
        res
          .status(406)
          .send({ success: false, err_message: "existed username" });
      }
    } else {
      res.status(406).send({ success: false, err_message: "existed email" });
    }
  },
};
