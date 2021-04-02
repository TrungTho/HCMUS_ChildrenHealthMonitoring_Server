const diaryModel = require("../../../models/diary.model");
const lullabyModel = require("../../../models/lullaby.model");
const newsModel = require("../../../models/news.model");
const recipeModel = require("../../../models/recipe.model");
const vaccineModel = require("../../../models/inoculate.model");
const axios = require("axios").default;
const jwt = require("jsonwebtoken");
const utilFunction = require("../../../utils/util-function");

module.exports = testController = {
  testFullText: async function (req, res) {
    const token = utilFunction.encodedToken("abc@gmail.com", 0);
    res.send(token);
  },

  logConnectionStats: async function (req, res) {
    // const item = {
    //   host: process.env.DB_HOST,
    //   username: process.env.DB_USERNAME,
    //   pass: process.env.DB_PASSWORD,
    //   database: process.env.DB_NAME,
    // };
    // // console.log(item);
    try {
      const token = req.query.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET_OR_KEY);
      res.send(decoded);
    } catch (error) {
      res.send("expire");
    }
  },

  manualMail: async function (req, res) {
    axios({
      method: "post",
      url:
        process.env.MAIL_SERVER + "/vaccine-notification-mail/manual-send-mail",
      withCredentials: true,
    })
      .then(function (response) {
        // console.log(response);
        return res.send({ success: true, datum: response.data });
      })
      .catch(function (error) {
        // console.log(error);
        return res.send({ success: false, error });
      });
  },
};
