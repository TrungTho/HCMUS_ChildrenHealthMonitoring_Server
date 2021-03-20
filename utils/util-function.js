const jwt = require("jsonwebtoken");
const cloudinary = require("../middlewares/cloudinary.mdw");

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
  encodedToken: (dataToEncoded) => {
    return jwt.sign(
      {
        iss: process.env.DEVELOPERS,
        sub: dataToEncoded,
        iat: new Date().getTime(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60, //an hour
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
};
