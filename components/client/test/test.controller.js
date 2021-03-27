const diaryModel = require("../../../models/diary.model");
const lullabyModel = require("../../../models/lullaby.model");
const newsModel = require("../../../models/news.model");
const recipeModel = require("../../../models/recipe.model");
const vaccineModel = require("../../../models/inoculate.model");
const axios = require("axios").default;

module.exports = testController = {
  testFullText: async function (req, res) {
    const query = req.query.a;
    const ret = await vaccineModel.searchAll(query);
    res.send(ret);
  },

  logConnectionStats: async function (req, res) {
    const item = {
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      pass: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    };
    // console.log(item);
    res.send(item);
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
