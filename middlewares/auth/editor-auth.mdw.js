//middleware function to check right of client to access profile

module.exports = function editorAuth(req, res, next) {
  if (parseInt(req.user.permission) === 2) {
  } else {
    return res
      .status(403)
      .send({ success: false, err_message: "invalid request" });
  }

  next();
};
