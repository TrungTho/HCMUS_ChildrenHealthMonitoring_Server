const jwt = require("jsonwebtoken");
const cloudinary = require("../middlewares/cloudinary.mdw");
const nodemailer = require("nodemailer");
const weightHeightStandardModel = require("../models/weight-height-standard.model");

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

  weightStandardsForMale: {},
  heightStandardsForMale: {},
  weightStandardsForFemale: {},
  heightStandardsForFemale: {},

  //singleton for loading standards
  getStandard: async function (type, gender) {
    //check init
    if (
      !this.weightStandardsForFemale ||
      Object.keys(this.heightStandardsForFemale).length === 0
    ) {
      await this.loadStandards();
    }

    if ((type === "w") & (gender === 1)) {
      return this.weightStandardsForMale;
    } else if ((type === "w") & (gender === 0)) {
      return this.weightStandardsForFemale;
    } else if ((type === "h") & (gender === 1)) {
      return this.heightStandardsForMale;
    } else if ((type === "h") & (gender === 0)) {
      return this.heightStandardsForFemale;
    }
  },

  loadStandards: async function () {
    console.log("load standards from db");
    //get standards
    const weightForMale = await weightHeightStandardModel.getAllByOption(
      "w",
      0
    );
    const weightForFemale = await weightHeightStandardModel.getAllByOption(
      "w",
      1
    );

    const heightForMale = await weightHeightStandardModel.getAllByOption(
      "h",
      0
    );
    const heightForFemale = await weightHeightStandardModel.getAllByOption(
      "h",
      1
    );
    for (let item of weightForMale) {
      this.weightStandardsForMale[item.month] = {
        lower_point: item.lower_point,
        average_point: item.average_point,
        upper_point: item.upper_point,
      };
    }

    for (let item of heightForMale) {
      this.heightStandardsForMale[item.month] = {
        lower_point: item.lower_point,
        average_point: item.average_point,
        upper_point: item.upper_point,
      };
    }

    for (let item of weightForFemale) {
      this.weightStandardsForFemale[item.month] = {
        lower_point: item.lower_point,
        average_point: item.average_point,
        upper_point: item.upper_point,
      };
    }
    for (let item of heightForFemale) {
      this.heightStandardsForFemale[item.month] = {
        lower_point: item.lower_point,
        average_point: item.average_point,
        upper_point: item.upper_point,
      };
    }
  },

  uploadImage: async function (req, preset) {
    try {
      let fileUploaded = [];
      let uploadResponse = { url: "" };

      //check if req.file is existed or not
      if (req.files) {
        fileUploaded = fileUploaded.concat(req.files.uploadImg);

        for (const image of fileUploaded) {
          //upload file to cloudinary
          let tmpUpload = await cloudinary.uploader.upload(image.tempFilePath, {
            upload_preset: preset, //choose configed preset to store image
          });

          uploadResponse.url += tmpUpload.url + ", ";
        }
      }

      return uploadResponse;
    } catch (error) {
      console.log("error:", error);
    }
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
