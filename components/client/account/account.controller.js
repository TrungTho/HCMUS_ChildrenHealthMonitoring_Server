const bcrypt = require("bcryptjs");
const moment = require("moment");
const multer = require("multer");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const userModel = require("../../../models/user.model");

//function to generate new jwt token
const encodedToken = (dataToEncoded) => {
  return jwt.sign(
    {
      iss: process.env.DEVELOPERS,
      sub: dataToEncoded,
      iat: new Date().getTime(),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, //an hour
    },
    process.env.JWT_SECRET_OR_KEY
  );
};

module.exports = accountController = {
  getProfile: async function (req, res) {
    req.user.dob = moment(req.user.dob, "YYYY-MM-DD").format("DD/MM/YYYY"); //convert from db's format to user's friendly format
    res.send({ userInfor: req.user });
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
          res.send({ success: false, err_message: "wrong password" });
        }
      } catch (error) {
        res.send({ success: false, err_message: error });
      }
    } else {
      res.send({ success: false, err_message: "invalid token" });
    }
  },

  login: async function (req, res) {
    if (req.user == "Unauthorized") {
      res.send({ success: false });
    } else {
      const token = encodedToken(req.user.username);

      //res.setHeader("Authorization", token);
      res.cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60, //1hour
      });
      res.send({ success: true });
    }
  },

  logout: async function (req, res) {
    res.clearCookie(process.env.COOKIE_NAME).send({ success: true });
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
        res.json({ success: false, err_message: "existed username" });
      }
    } else {
      res.json({ success: false, err_message: "existed email" });
    }
  },
};
