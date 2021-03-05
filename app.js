const express = require("express");
require("express-async-errors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();

//parser
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

// app.use("/public", express.static("public"));
// require("./middlewares/view.mdw")(app);
// require("./middlewares/session.mdw")(app);
// require("./middlewares/local.mdw")(app);

// require("./middlewares/schedule-task.mdw")(app); //mdw to do anything scheduled automatically without client's req
require("./middlewares/routes.mdw")(app); //mdw for routing
require("./middlewares/errors.mdw")(app); //mdw for err handling

//lang nghe o cong
const PORT = process.env.LISTENPORT;
app.listen(PORT, () => {
  //console.log(`Example app listening at http://localhost:${PORT}`);
});
