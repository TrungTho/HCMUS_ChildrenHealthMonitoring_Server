const cron = require("node-cron");

module.exports = function (app) {
  cron.schedule("* * * * * *", () => {
    console.log("hehe");
  });
};
