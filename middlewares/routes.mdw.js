const isAuth = require("./auth.mdw");
const isAdmin = require("./admin.mdw");

module.exports = function (app) {
  //tao ra tai nguyen web
  //req - request tu client, res - response tu server
  // app.use("/", require("../routes/client/home.route"));
  // app.use(
  //   "/admin/categories",
  //   isAdmin,
  //   require("../routes/admin/category.route")
  // );
  // app.use("/admin/user", isAdmin, require("../routes/admin/user.route"));
  // app.use("/admin/course", isAdmin, require("../routes/admin/course.route"));
  // app.use("/course", require("../routes/client/course.route"));
  // app.use("/search", require("../routes/client/search.route"));
  // app.use("/my-course", isAuth, require("../routes/client/my-course.route"));
  // app.use("/wishlist", isAuth, require("../routes/client/wishlist.route"));
  // app.use("/cart", isAuth, require("../routes/client/cart.route"));
  app.use("/test", require("../components/client/test/test.route"));
  app.use("/account", require("../components/client/account/account.route"));
};
