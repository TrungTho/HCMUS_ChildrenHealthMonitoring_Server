const newsModel = require("../../../models/news.model");
const utilFuncs = require("../../../utils/util-function");
const editorPostModel = require("../../../models/editor-post.model");

module.exports = newsController = {
  //we will consider an option to editor del post "logically"
  //send message to admin and admin will del it in db?
  // deletePost: async function (req, res) {
  //   try {
  //     await newsModel.setDelete(req.body.id);
  //     res.send({ success: true });
  //   } catch (error) {
  //     res.status(406).send({ success: false, err_message: error });
  //   }
  // },

  getAllPost: async function (req, res) {
    try {
      const data = await newsModel.editorGetAllById(req.user.id);

      //send data to client
      res.send({ success: true, posts: data });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  newPost: async function (req, res) {
    try {
      // //call global function to upload main_cover
      // const uploadResponse = await utilFuncs.uploadImage(
      //   req,
      //   process.env.CLOUD_POST_PRESET
      // );

      //create new Post according to user input
      const newPost = {
        shortDes: req.body.shortDes,
        fullDes: req.body.fullDes,
        // main_cover: uploadResponse.url,
        main_cover: req.body.uploadImg,
        isApproved: 1,
        log_date: new Date(),
        trendRank: req.body.trendRank,
      };

      //add new diary to db
      const ret = await newsModel.add(newPost);

      //create new record link editor - post
      const newEditorPost = {
        id_user: req.user.id,
        id_post: ret.insertId,
        typeOfPost: "news",
      };

      //add new diary to db
      await editorPostModel.add(newEditorPost);

      //get full datum back from db to check add successfully
      const datum = await newsModel.editorGetSingle(ret.insertId);

      //send success message to client
      res.send({ success: true, postInfor: datum });
    } catch (error) {
      console.log(error);
      res.status(406).send({ success: false, err_message: error });
    }
  },

  updatePost: async function (req, res) {
    try {
      //create new Post according to user input
      const updatedPost = {
        id: req.body.id,
        shortDes: req.body.shortDes,
        fullDes: req.body.fullDes,
        trendRank: req.body.trendRank,
        main_cover: req.body.uploadImg,
        log_date: new Date(),
        isApproved: 0,
      };

      // //check if user want to change images or not
      // if (req.body.isImageChange === "true") {
      //   const uploadResponse = await utilFuncs.uploadImage(
      //     req,
      //     process.env.CLOUD_POST_PRESET
      //   );

      //   updatedPost.main_cover = uploadResponse.url;
      // }

      //add new diary to db
      await newsModel.update(updatedPost);

      const datum = await newsModel.editorGetSingle(req.body.id);

      //send success message to client
      res.send({ success: true, postInfor: datum });
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
