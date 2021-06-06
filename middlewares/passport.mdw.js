const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const GooglePlusTokenStrategy = require("passport-google-plus-token");
const FacebookTokenStrategy = require("passport-facebook-token");
const utilFuncs = require("../utils/util-function");

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
        // console.log("cookie valid!!!");

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

      const userPass = await userModel.getPassByUsername(datum.username);
      if (datum !== null) {
        const ret = bcrypt.compareSync(password, userPass);

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

passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log("1", accessToken);
        // console.log("2", refreshToken);
        // console.log("3", profile);

        //check if user existed or not
        const datum = await userModel.getSingleByEmail(profile.emails[0].value);

        if (datum) {
          //return user infor to client
          return done(null, datum);
        } else {
          //first login by google => create new account
          //create item has user's infor
          const newItem = {
            username: profile.emails[0].value.split("@")[0],
            email: profile.emails[0].value,
            password: "",
            dob: new Date(),
            permission: 0,
            fullname: profile.displayName,
            isDisable: 0,
            isVerified: 0,
            avatar: profile.photos[0].value,
            authType: "google",
          };

          // console.log("----------------");
          // console.log(newItem);

          //add new user to db
          await userModel.add(newItem);

          //get user infor back from db
          const userInfor = await userModel.getSingleByEmail(
            profile.emails[0].value
          );

          //send email confirm
          await utilFuncs.sendMail({
            destination: newItem.email,
            subject: "Children Health Monitoring confirm account",
            html: `Here your verify link:
<a href="${
              process.env.ALLOW_ORIGIN
            }/account/verify-account?verify_token=${utilFuncs.encodedTokenWithoutExpiration(
              newItem.email
            )}" > Click me!
</a>`,
          });
          //return to controller
          done(null, userInfor);
        }
      } catch (error) {
        done(error, false); //loi
      }
    }
  )
);

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log("1", accessToken);
        // console.log("2", refreshToken);
        // console.log("3", profile);

        //check if user existed or not
        const datum = await userModel.getSingleByEmail(profile.emails[0].value);

        if (datum) {
          //return user infor to client
          return done(null, datum);
        } else {
          //first login by google => create new account
          //create item has user's infor
          const newItem = {
            username: profile.emails[0].value.split("@")[0],
            email: profile.emails[0].value,
            password: "",
            dob: new Date(),
            permission: 0,
            fullname: profile.displayName,
            isDisable: 0,
            isVerified: 0,
            avatar: profile.photos[0].value,
            authType: "facebook",
          };

          // console.log("----------------");
          // console.log(newItem);

          //add new user to db
          await userModel.add(newItem);

          //get user infor back from db
          const userInfor = await userModel.getSingleByEmail(
            profile.emails[0].value
          );

          //send email confirm
          await utilFuncs.sendMail({
            destination: newItem.email,
            subject: "Children Health Monitoring confirm account",
            html: `Here your verify link:
  <a href="${
    process.env.ALLOW_ORIGIN
  }/account/verify-account?verify_token=${utilFuncs.encodedTokenWithoutExpiration(
              newItem.email
            )}" > Click me!
  </a>`,
          });

          //return to controller
          done(null, userInfor);
        }
      } catch (error) {
        done(error, false); //loi
      }
    }
  )
);

module.exports = passport;
