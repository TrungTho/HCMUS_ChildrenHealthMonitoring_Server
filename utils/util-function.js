const jwt = require("jsonwebtoken");
const cloudinary = require("../middlewares/cloudinary.mdw");
const nodemailer = require("nodemailer");

module.exports = {
  //parameter func to compare array's element
  compareAsc: (a, b) => {
    if (a.log_date > b.log_date) return 1;
    if (b.log_date > a.log_date) return -1;

    return 0;
  },

  compareDesc: (a, b) => {
    if (a.log_date > b.log_date) return -1;
    if (b.log_date > a.log_date) return 1;

    return 0;
  },

  //function to generate new jwt token
  encodedToken: (dataToEncoded, numberOfHours) => {
    return jwt.sign(
      {
        iss: process.env.DEVELOPERS,
        sub: dataToEncoded,
        iat: new Date().getTime(),
        exp: Math.floor(Date.now() / 1000) + numberOfHours * 60 * 60, //8 hours
      },
      process.env.JWT_SECRET_OR_KEY
    );
  },
  //function to generate new jwt token
  encodedTokenWithoutExpiration: (dataToEncoded) => {
    return jwt.sign(
      {
        iss: process.env.DEVELOPERS,
        sub: dataToEncoded,
        iat: new Date().getTime(),
      },
      process.env.JWT_SECRET_OR_KEY
    );
  },

  //function to generate the current date in db's format
  getCurrentDate: () => {
    var today = new Date();
    return (
      today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
    );
  },

  uploadImage: async function (req, preset) {
    let fileUploaded = [],
      uploadResponse = { url: "" };

    //check if req.file is existed or not
    if (req.files) {
      fileUploaded = req.files.uploadImg;

      //upload file to cloudinary
      uploadResponse = await cloudinary.uploader.upload(
        fileUploaded.tempFilePath,
        {
          upload_preset: preset, //choose configed preset to store image
        }
      );
    }

    return uploadResponse;
  },

  sendMail: async function (emailContent) {
    //send email confirm
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.CONTACT_EMAIL,
      to: emailContent.destination,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
};
