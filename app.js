const express = require("express");
require("express-async-errors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();

//parser
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(
  cors({
    origin: process.env.REACT_SERVER, //block all except this domain
    credentials: true, //turn on cookie http through
  })
);

// app.use("/public", express.static("public"));
// require("./middlewares/view.mdw")(app);
// require("./middlewares/session.mdw")(app);
// require("./middlewares/local.mdw")(app);

// require("./middlewares/schedule-task.mdw")(app); //mdw to do anything scheduled automatically without client's req
require("./middlewares/routes.mdw")(app); //mdw for routing
require("./middlewares/errors.mdw")(app); //mdw for err handling

//lang nghe o cong
const PORT = process.env.LISTENPORT;
app.listen(PORT || 3000, () => {
  //console.log(`Example app listening at http://localhost:${PORT}`);
});
