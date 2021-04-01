const newsModel = require("../../../models/news.model");
const recipeModel = require("../../../models/recipe.model");
const tipModel = require("../../../models/tip.model");
const utilFunction = require("../../../utils/util-function");

module.exports = postController = {
  approvePost: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getAllPost: async function (req, res) {
    try {
      //get data from db
      const tipPosts = await tipModel.adminGetAll();
      const recipePosts = await recipeModel.adminGetAll();
      const vaccinePosts = await newsModel.adminGetAll();

      //combine 3 type of post to one
      const allPosts = tipPosts.concat(recipePosts).concat(vaccinePosts);

      //sort posts depend on createDate
      allPosts.sort(utilFunction.compareDesc);

      //send data to client
      res.send({ success: true, posts: allPosts });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getTipPost: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getVaccinePost: async function (req, res) {
    try {
      res.send({ success: true });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getRecipePost: async function (req, res) {
    try {
      res.send({ success: true });
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
};
