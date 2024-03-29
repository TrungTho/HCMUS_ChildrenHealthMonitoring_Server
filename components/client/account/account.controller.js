const bcrypt = require("bcryptjs");
const moment = require("moment");
const userModel = require("../../../models/user.model");
const cloudinary = require("../../../middlewares/cloudinary.mdw");
const utilFuncs = require("../../../utils/util-function");
const jwt = require("jsonwebtoken");
const diaryModel = require("../../../models/diary.model");

const prepareContentMail = async function (req, newItem) {
  return `

  <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td bgcolor="#88d8b0" align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
              <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td bgcolor="#88d8b0" align="center" style="padding: 0px 10px 0px 10px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
              <td bgcolor="#ffffff" align="center" valign="top"
                style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Xác minh tài khoản</h1> <img
                  src="https://i.ibb.co/6JzRmrk/logo.png" width="60" height="60" style="display: block; border: 0px;" />
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
            <tr>
              <td bgcolor="#ffffff" align="left"
                style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                <p style="margin: 0;">Vui lòng nhấn vào nút bên dưới để xác thực tài khoản của bạn.</p>
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" align="left">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                      <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center" style="border-radius: 3px;" bgcolor="#88d8b0">
                            <a target="_blank" href="${process.env.REACT_SERVER
    }/auth/${utilFuncs.encodedTokenWithoutExpiration(
      newItem.email
    )}/verify-successful"
                              style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #88d8b0; display: inline-block;">Confirm
                              Account
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" align="left"
                style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                <p style="margin: 0;">Hoặc dán đường dẫn bên dưới vào trình duyệt để xác minh:</p>
              </td>
            </tr> <!-- COPY -->
            <tr>
              <td bgcolor="#ffffff" align="left"
                style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                <p style="margin: 0;"><a href="#" target="_blank"
                    style="color: #88d8b0;">${process.env.REACT_SERVER
    }/auth/${utilFuncs.encodedTokenWithoutExpiration(
      newItem.email
    )}/verify-successful</a></p>
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" align="left"
                style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                <p style="margin: 0;">Xin cảm ơn,<br>CHM team</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>`;
};

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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  googleLoginFe: async function (req, res) {
    try {
      const profile = req.body.profile;
      console.log("3", profile);

      //check if user existed or not
      const datum = await userModel.getSingleByEmail(profile.email);

      if (datum) {
        //return user infor to client
      } else {
        //first login by google => create new account
        //create item has user's infor
        const newItem = {
          username: profile.email.split("@")[0],
          email: profile.email,
          password: "",
          dob: new Date(),
          permission: 0,
          fullname: profile.name,
          isDisable: 0,
          isVerified: 0,
          avatar: profile.imageUrl,
          authType: "google",
        };

        // console.log("----------------");
        // console.log(newItem);

        //add new user to db
        await userModel.add(newItem);

        //get user infor back from db

        const mailContent = await prepareContentMail(req, newItem);

        //send email confirm
        await utilFuncs.sendMail({
          destination: newItem.email,
          subject: "Children Health Monitoring confirm account",
          html: mailContent,
        });
      }

      const userInfor = await userModel.getSingleByEmail(profile.email);
      const token = utilFuncs.encodedToken(userInfor.username, 8);

      //res.setHeader("Authorization", token);
      res.cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 8, //8 hours
      });
      res.send({
        success: true,
        userInfor: {
          username: userInfor.username,
          fullname: userInfor.fullname,
          avatar: userInfor.avatar,
          email: userInfor.email,
          permission: userInfor.permission,
        },
      });
    } catch (e) {
      throw e;
    }
  },

  facebookLoginFe: async function (req, res) {
    try {
      const profile = req.body.profile;
      console.log("3", profile);

      //check if user existed or not
      const datum = await userModel.getSingleByEmail(profile.email);

      if (datum) {
        //return user infor to client
      } else {
        //first login by google => create new account
        //create item has user's infor
        const newItem = {
          username: profile.email.split("@")[0],
          email: profile.email,
          password: "",
          dob: new Date(),
          permission: 0,
          fullname: profile.name,
          isDisable: 0,
          isVerified: 0,
          avatar: profile.picture.data.url,
          authType: "facebook",
        };

        // console.log("----------------");
        // console.log(newItem);

        //add new user to db
        await userModel.add(newItem);

        //get user infor back from db

        const mailContent = await prepareContentMail(req, newItem);

        //send email confirm
        await utilFuncs.sendMail({
          destination: newItem.email,
          subject: "Children Health Monitoring confirm account",
          html: mailContent,
        });
      }

      const userInfor = await userModel.getSingleByEmail(profile.email);
      const token = utilFuncs.encodedToken(userInfor.username, 8);

      //res.setHeader("Authorization", token);
      res.cookie("auth_token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 8, //8 hours
      });
      res.send({
        success: true,
        userInfor: {
          username: userInfor.username,
          fullname: userInfor.fullname,
          avatar: userInfor.avatar,
          email: userInfor.email,
          permission: userInfor.permission,
        },
      });
    } catch (e) {
      throw e;
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
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  login: async function (req, res) {
    if (req.user == "Unauthorized") {
    } else {
      const token = utilFuncs.encodedToken(req.user.username, 8);

      //res.setHeader("Authorization", token);
      res.cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 8, //8 hours
        // sameSite: "None",
        // secure: true,
      });
      res.send({
        success: true,
        userInfor: {
          username: req.user.username,
          fullname: req.user.fullname,
          avatar: req.user.avatar,
          email: req.user.email,
          permission: req.user.permission,
        },
      });
    }
  },

  logout: async function (req, res) {
    try {
      res.cookie(process.env.COOKIE_NAME, "invalid", {
        httpOnly: true,
        maxAge: 0, //8 hours
        // sameSite: 'None',
        // secure: true,
      });
      res.send({ success: true });
    } catch (error) {
      console.log(error);
      console.log(error);
    }
  },

  updateProfile: async function (req, res) {
    //first check if user in token is user want to update profile or not?
    if (req.user.username === req.body.username) {
      try {
        const userPass = null; //await userModel.getPassByUsername(req.user.username);
        //check if password is valid or not
        if (true || bcrypt.compareSync(req.body.password, userPass)) {
          //user dont need to send pass anymore
          const newUser = {
            id: req.user.id,
            username: req.user.username, //username cant be changed
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
        console.log(error);
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
            authType: "local",
          };
          // console.log(newUser);

          //add user data to db
          await userModel.add(newUser);
          const mailContent = await prepareContentMail(req, newUser);

          //send email confirm
          await utilFuncs.sendMail({
            destination: newUser.email,
            subject: "Children Health Monitoring confirm account",
            html: mailContent,
          });

          res.json({ success: true });
        } catch (error) {
          console.log(error);
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
      console.log(error);
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
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  template: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      console.log(error);
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
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },
};
