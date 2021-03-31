const adminAuth = require("./auth/admin-auth.mdw");
const editorAuth = require("./auth/editor-auth.mdw");
const passport = require("../middlewares/passport.mdw");

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

  //--------------------client route-----------------
  app.use("/test", require("../components/client/test/test.route"));
  app.use("/account", require("../components/client/account/account.route"));
  app.use("/handbook/tip", require("../components/client/handbook/tip.route"));
  app.use(
    "/handbook/recipe",
    require("../components/client/handbook/recipe.route")
  );
  app.use(
    "/diary",
    passport.authenticate("jwt", { session: false }),
    require("../components/client/diary/diary.route")
  );

  app.use(
    "/event/weight-height",
    passport.authenticate("jwt", { session: false }),
    require("../components/client/event/weight-height-event.route")
  );

  app.use(
    "/event/vaccine",
    passport.authenticate("jwt", { session: false }),
    require("../components/client/event/vaccine-event.route")
  );

  app.use(
    "/event/teeth",
    passport.authenticate("jwt", { session: false }),
    require("../components/client/event/teeth-event.route")
  );

  app.use(
    "/event/custom",
    passport.authenticate("jwt", { session: false }),
    require("../components/client/event/custom-event.route")
  );

  //---------------------editor route------------------
  app.use(
    "/editor/post/tip",
    passport.authenticate("jwt", { session: false }),
    editorAuth,
    require("../components/editor/tip/tip.route")
  );

  //---------------------admin route------------------
  app.use(
    "/admin/user",
    passport.authenticate("jwt", { session: false }),
    adminAuth,
    require("../components/admin/account/user.route")
  );
  app.use(
    "/admin/vaccine",
    passport.authenticate("jwt", { session: false }),
    adminAuth,
    require("../components/admin/vaccine/vaccine.route")
  );
  app.use(
    "/admin/notification",
    passport.authenticate("jwt", { session: false }),
    adminAuth,
    require("../components/admin/notification/notification.route")
  );
};
