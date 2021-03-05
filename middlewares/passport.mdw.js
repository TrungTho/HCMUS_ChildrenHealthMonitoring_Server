const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const { ExtractJwt } = require("passport-jwt");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");

passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //local storage
      secretOrKey: "privateKey",
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
      const datum = await userModel.getSingleByUsername(username);

      if (datum !== null) {
        const ret = bcrypt.compareSync(password, datum.f_Password);

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
