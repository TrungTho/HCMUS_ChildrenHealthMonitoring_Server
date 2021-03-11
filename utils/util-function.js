const jwt = require("jsonwebtoken");

module.exports = {
  //function to generate new jwt token
  encodedToken: (dataToEncoded) => {
    return jwt.sign(
      {
        iss: process.env.DEVELOPERS,
        sub: dataToEncoded,
        iat: new Date().getTime(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60, //an hour
      },
      process.env.JWT_SECRET_OR_KEY
    );
  },

  //function to generate the current date in db's format
  getCurrentDate: () => {
    var today = new Date();
    return (
      today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
    );
  },
};
