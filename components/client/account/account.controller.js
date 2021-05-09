const bcrypt = require("bcryptjs");
const moment = require("moment");
const userModel = require("../../../models/user.model");
const cloudinary = require("../../../middlewares/cloudinary.mdw");
const utilFuncs = require("../../../utils/util-function");
const jwt = require("jsonwebtoken");
const diaryModel = require("../../../models/diary.model");

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

  changePassword: async function (req, res) {
    try {
      //get data from req
      const changePassToken = req.query.token;
      const newPassword = req.body.password;

      //verify token
      const decodedToken = jwt.verify(
        changePassToken,
        process.env.JWT_SECRET_OR_KEY
      );

      //get user data from db depend on token's param
      const userData = await userModel.getSingleByEmail(decodedToken.sub);

      //check user exist and verify account
      if (userData) {
        //set new password for data
        userData.password = bcrypt.hashSync(
          newPassword,
          parseInt(process.env.ACCOUNT_TIMEHASHPASS)
        );
        //update data in db
        await userModel.update(userData);

        //get data just update
        const datum = await userModel.getSingle(userData.id);
        return res.send({
          success: true,
          userInfor: {
            username: datum.username,
            fullname: datum.fullname,
            avatar: datum.avatar,
            email: datum.email,
          },
        });
      }

      res.send({ success: false, err_message: "invalid token" });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getProfile: async function (req, res) {
    req.user.dob = moment(req.user.dob, "YYYY-MM-DD").format("DD/MM/YYYY"); //convert from db's format to user's friendly format
    res.send({ userInfor: req.user });
  },

  googleLogin: async function (req, res) {
    try {
      {
        const token = utilFuncs.encodedToken(req.user.username, 8);

        //res.setHeader("Authorization", token);
        res.cookie("auth_token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 8, //8 hours
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
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  facebookLogin: async function (req, res) {
    try {
      // return res.send(req.user);
      const token = utilFuncs.encodedToken(req.user.username, 8);

      //res.setHeader("Authorization", token);
      res.cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 8, //8 hours
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
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  login: async function (req, res) {
    if (req.user == "Unauthorized") {
    } else {
      const token = utilFuncs.encodedToken(req.user.username, 8);

      //res.setHeader("Authorization", token);
      res.cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 8, //8 hours
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
        const userPass = await userModel.getPassByUsername(req.user.username);
        //check if password is valid or not
        if (bcrypt.compareSync(req.body.password, userPass)) {
          const newUser = {
            id: req.user.id,
            username: req.user.username, //username cant be changed
            password: userPass,
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
      res.status(406).send({ success: false, err_message: "invalid username" });
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
          // console.log(newUser);

          //add user data to db
          await userModel.add(newUser);

          //send email confirm
          await utilFuncs.sendMail({
            destination: newUser.email,
            subject: "Children Health Monitoring confirm account",
            html: `Here your verify link:
            <a href="${
              process.env.ALLOW_ORIGIN
            }/account/verify-account?verify_token=${utilFuncs.encodedTokenWithoutExpiration(
              req.body.mail
            )}" > Click me!
            </a>`,
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

  requestChangePass: async function (req, res) {
    try {
      //get data from user input
      const userEmail = req.body.email;

      //get data from db to authen
      const datum = await userModel.getSingleByEmail(userEmail);
      if (datum) {
        //generate token with exp = 30 minutes
        const resetPassToken = utilFuncs.encodedToken(userEmail, 0.5);

        //send reset pass mail to user's email
        await utilFuncs.sendMail({
          destination: userEmail,
          subject:
            "Children Health Monitoring reset account's password confirm",
          html: `Here your change password link:
          <a href="${process.env.ALLOW_ORIGIN}/account/change-password?token=${resetPassToken}" > Click me!
          </a>`,
        });

        return res.send({ success: true });
      }

      res.status(406).send({ success: false, err_message: "invalid email!" });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  verifyAccount: async function (req, res) {
    try {
      //get token from url and decode it
      const token = req.query.verify_token;

      //console.log("token", token);

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_OR_KEY);

      // console.log("decodedToken", decodedToken);

      //get user data from db depend on token's param
      const userData = await userModel.getSingleByEmail(decodedToken.sub);

      // console.log("userData", userData);

      //check user exist and verify account
      if (userData) {
        await userModel.setVerified(userData.id);
        //get data just update
        const datum = await userModel.getSingle(userData.id);

        //set all diaries of this user with default mail = true
        const userDiaries = await diaryModel.getAllByUserId(datum.id);
        for (item of userDiaries) {
          diaryModel.flipDefaultMailing(item.id);
        }

        return res.send({ success: true, user: datum });
      }
      res.send({ success: false, err_message: "invalid token" });
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

  changePasswordWhenSignedIn: async function (req, res) {
    try {
      console.log("begin");
      const { currentPassword, newPassword } = req.body;
      const userPassInDb = await userModel.getPassByUsername(req.user.username);

      const ret = bcrypt.compareSync(currentPassword, userPassInDb);

      //check user exist and verify account
      if (userPassInDb && bcrypt.compareSync(currentPassword, userPassInDb)) {
        const userData = await userModel.getSingleByEmail(req.user.email);
        console.log(userData);

        //set new password for data
        userData.password = bcrypt.hashSync(
          newPassword,
          parseInt(process.env.ACCOUNT_TIMEHASHPASS)
        );
        //update data in db
        await userModel.update(userData);

        //get data just update
        const datum = await userModel.getSingle(userData.id);
        return res.send({
          success: true,
          userInfor: {
            username: datum.username,
            fullname: datum.fullname,
            avatar: datum.avatar,
            email: datum.email,
          },
        });
      }

      res.status(406).send({ success: false, err_message: "invalid password" });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },
};
