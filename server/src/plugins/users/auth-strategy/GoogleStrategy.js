import { Strategy } from "passport-google-oauth20";
const GoogleMobileStrategy = require("passport-local").Strategy;
import Axios from "axios";
import config from "config";

const log = require("logfilename")(__filename);

const axios = Axios.create({
  baseURL: "https://www.googleapis.com/",
  timeout: 30e3
});

const profileWebToUser = profile => ({
  username: profile.displayName,
  email: profile.emails[0].value,
  firstName: profile.name.givenName,
  lastName: profile.name.familyName,
  picture: profile.image,
  authProvider: {
    name: "google",
    authId: profile.id
  }
});

const profileMobileToUser = profile => ({
  username: profile.name,
  email: profile.email,
  firstName: profile.givenName,
  lastName: profile.familyName,
  authProvider: {
    name: "google",
    authId: profile.id
  }
});

export async function verifyWeb(
  models,
  publisherUser,
  accessToken,
  userConfig
) {
  log.debug(`verifyWeb google ${accessToken}`, userConfig);
  log.debug(`email `, userConfig.email);

  const userByEmail = await models.User.findByEmail(userConfig.email);

  if (userByEmail) {
    log.debug("email already registered ");
    //should update fb profile id
    return {
      user: userByEmail.toJSON()
    };
  }
  log.debug("creating user: ", userConfig);
  let user = await models.User.createUserInGroups(userConfig, ["User"]);
  let userCreated = user.toJSON();

  log.info("register created new user ", userCreated);
  if (publisherUser) {
    console.log("publisherUser", publisherUser);
    await publisherUser.publish("user.registered", JSON.stringify(userCreated));
  }
  return {
    user: userCreated
  };
}

export async function verifyMobile(
  models,
  publisherUser,
  userID,
  access_token
) {
  log.debug("verifyMobile ", access_token);

  try {
    const result = await axios.get("userinfo/v2/me", {
      params: {
        access_token
      },
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    const profile = result.data;
    log.debug("verifyMobile profile ", profile);
    return verifyWeb(models, publisherUser, access_token, profileMobileToUser(profile));
  } catch (error) {
    log.error("verifyMobile google ", error);
    return {
      error: {
        message: "InvalidToken"
      }
    };
  }
}

export function registerWeb(passport, models, publisherUser) {
  const googleConfig = config.authentication.google;
  if (googleConfig) {
    log.info("registerWeb");
    const strategy = new Strategy(googleConfig, async function(
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      try {
        log.info(" registerWeb", profile);
        const res = await verifyWeb(
          models,
          publisherUser,
          accessToken,
          profileWebToUser(profile)
        );
        done(res.err, res.user);
      } catch (err) {
        done(err);
      }
    });
    passport.use("google", strategy);
  }
}

export function registerMobile(passport, models, publisherUser) {
  log.info("configuring google mobile authentication strategy");
  const mobileStrategy = new GoogleMobileStrategy(
    {
      usernameField: "userId",
      passwordField: "token",
      passReqToCallback: false
    },
    async function(userID, token, done) {
      try {
        let res = await verifyMobile(models, publisherUser, userID, token);
        done(res.error, res.user);
      } catch (err) {
        done(err);
      }
    }
  );
  passport.use("google_mobile", mobileStrategy);
}
