//middleware function to check right of client to access profile

module.exports = function adminAuth(req, res, next) {
  if (req.user.username === process.env.ADMIN_USERNAME) {
    console.log("ok admin");
  } else {
    return;
  }

  next();
};
