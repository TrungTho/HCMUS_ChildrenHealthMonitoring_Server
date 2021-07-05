const newsModel = require("../../../models/news.model");
const recipeModel = require("../../../models/recipe.model");
const tipModel = require("../../../models/tip.model");
const utilFunction = require("../../../utils/util-function");

module.exports = postController = {
  approvePost: async function (req, res) {
    try {
      //get data from client's req
      const typeOfPost = req.body.typeOfPost;
      const postId = req.body.id;
      let datum;

      //check type of post needs to approve
      switch (typeOfPost) {
        case "tip":
          //flip state of post
          tipModel.flipApproval(postId);
          //get new datum of post to send to client
          datum = await tipModel.editorGetSingle(postId);
          //send to client
          res.send({ success: true, post: datum });
          break;
        case "news":
          newsModel.flipApproval(postId);

          datum = await newsModel.editorGetSingle(postId);
          //send to client
          res.send({ success: true, post: datum });
          break;
        case "recipe":
          recipeModel.flipApproval(postId);

          datum = await recipeModel.editorGetSingle(postId);
          //send to client
          res.send({ success: true, post: datum });
          break;

        default:
          return res
            .status(406)
            .send({ success: false, err_message: "invalid type of post!" });
          break;
      }
    } catch (error) {
      console.log(error);
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
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getTipPost: async function (req, res) {
    try {
      //get data from db
      const tipPosts = await tipModel.adminGetAll();

      //send data to client
      res.send({ success: true, tipPosts });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getVaccinePost: async function (req, res) {
    try {
      //get data from db
      const vaccinePosts = await newsModel.adminGetAll();

      //send data to client
      res.send({ success: true, newsPosts: vaccinePosts });
    } catch (error) {
      res.status(406).send({ success: false, err_message: error });
    }
  },

  getRecipePost: async function (req, res) {
    try {
      //get data from db
      const recipePosts = await recipeModel.adminGetAll();

      //send data to client
      res.send({ success: true, recipePosts });
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
};
