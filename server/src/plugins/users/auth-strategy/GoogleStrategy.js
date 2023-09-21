const assert = require("assert");
const _ = require("lodash");
const { Strategy } = require("passport-google-oauth20");
const GoogleTokenStrategy = require("passport-google-id-token");
const {
  createRegisterMobile,
  createVerifyMobile,
  verifyWeb,
} = require("./StrategyUtils");

const Axios = require("axios");
const config = require("config");

const log = require("logfilename")(__filename);

const axios = Axios.create({
  baseURL: "https://www.googleapis.com/",
  timeout: 30e3,
});

const profileWebToUser = (profile) => ({
  username: profile.displayName,
  email: profile.emails[0].value,
  first_name: profile.name.givenName,
  last_name: profile.name.familyName,
  picture: {
    url: profile.photos[0].value,
  },
  auth_type: "google",
  auth_id: profile.id,
});

const profileMobileToUser = (profile) => ({
  username: profile.name,
  email: profile.email,
  first_name: profile.given_name,
  last_name: profile.family_name,
  picture: {
    url: profile.picture,
  },
  auth_type: "google",
  auth_id: profile.id,
});

function verifyMobile({ models, publisherUser, accessToken }) {
  assert(models);
  assert(accessToken);

  const getMe = () =>
    axios
      .get("userinfo/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        log.debug("verifyMobile me: ", JSON.stringify(res.data, null, 4));
        return res;
      })
      .then((res) => profileMobileToUser(res.data));

  return createVerifyMobile({ getMe, models, publisherUser, accessToken });
}

function registerWeb({ passport, models, publisherUser }) {
  assert(models);
  const googleConfig = config.authentication.google;
  if (googleConfig && !_.isEmpty(googleConfig.clientID)) {
    const strategy = new Strategy(googleConfig, async function (
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      log.debug("registerWeb me: ", JSON.stringify(profile, null, 4));
      try {
        const res = await verifyWeb({
          models,
          publisherUser,
          userConfig: profileWebToUser(profile),
        });
        done(res.err, res.user);
      } catch (err) {
        done(err);
      }
    });
    passport.use("google", strategy);
  }
}

function registerMobile({ passport, models, publisherUser }) {
  assert(models);
  createRegisterMobile({
    name: "google",
    verifyMobile,
    passport,
    models,
    publisherUser,
  });

  // Standalone android
  passport.use(
    "google-id-token",
    new GoogleTokenStrategy({}, async (parsedToken, googleId, done) => {
      log.debug(
        `GoogleTokenStrategy: ${JSON.stringify(
          parsedToken,
          null,
          4
        )} ${googleId}`
      );

      try {
        const res = await verifyWeb({
          models,
          publisherUser,
          userConfig: profileMobileToUser({
            ...parsedToken.payload,
            id: googleId,
          }),
        });
        done(res.err, res.user);
      } catch (err) {
        log.error("GoogleTokenStrategy", err);
        done(err);
      }
    })
  );
}

exports.verifyMobile = verifyMobile;
exports.registerWeb = registerWeb;
exports.registerMobile = registerMobile;
