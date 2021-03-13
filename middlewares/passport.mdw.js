const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const { ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.auth_token;
  }
  return token;
};

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  const datum = await userModel.getSingleByUsername(username);
  if (datum !== null) {
    done(null, datum);
  }
});

passport.use(
  new JwtStrategy(
    {
      //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //local storage
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), //cookie
      secretOrKey: process.env.JWT_SECRET_OR_KEY,
    },
    async (payload, done) => {
      try {
        const datum = await userModel.getSingleByUsername(payload.sub); //get datum in db

        if (!datum) {
          return done(null, false); //return null if datum is not existed
        }

        done(null, datum); //return datum as user if everything true
      } catch (error) {
        done(error, false); //loi
      }
    }
  )
);

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      let datum;
      //check that user's input is email or username
      if (username.indexOf("@") === -1) {
        datum = await userModel.getSingleByUsername(username);
      } else {
        datum = await userModel.getSingleByEmail(username);
      }
      if (datum !== null) {
        const ret = bcrypt.compareSync(password, datum.password);

        if (ret) {
          return done(null, datum);
        }
      }
      return done(null, false);
    } catch (error) {
      done(error, false);
    }
  })
);

module.exports = passport;
