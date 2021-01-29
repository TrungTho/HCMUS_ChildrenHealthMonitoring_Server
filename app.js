const express = require("express");
require("express-async-errors");

const app = express();

//parser
app.use(
  express.urlencoded({
    extended: true,
  })
);

// app.use("/public", express.static("public"));
// require("./middlewares/view.mdw")(app);
// require("./middlewares/session.mdw")(app);
require("./middlewares/local.mdw")(app);
require("./middlewares/routes.mdw")(app);
require("./middlewares/errors.mdw")(app);

//lang nghe o cong
const PORT = 3500;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
