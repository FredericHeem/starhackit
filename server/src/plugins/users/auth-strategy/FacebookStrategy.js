const assert = require("assert");
const _ = require("lodash");
const FbWebStrategy = require("passport-facebook").Strategy;
const {
  createRegisterMobile,
  createVerifyMobile,
  verifyWeb,
} = require("./StrategyUtils");

//TODO
const config = require("config");
const Axios = require("axios");

const log = require("logfilename")(__filename);

const axios = Axios.create({
  baseURL: "https://graph.facebook.com/",
  timeout: 30e3,
});

const profileToUser = (profile, accessToken) => ({
  display_name: `${profile.first_name} ${
    profile.middle_name && profile.middle_name
  } ${profile.last_name}`,
  username: `${profile.first_name} ${
    profile.middle_name && profile.middle_name
  } ${profile.last_name}`,
  email: profile.email,
  first_name: profile.first_name,
  last_name: profile.last_name,
  picture: profile.picture && profile.picture.data,
  auth_type: "facebook",
  auth_id: profile.id,
});

const profileMobileToUser = (profile) => ({
  display_name: profile.name,
  username: profile.name,
  email: profile.email,
  first_name: profile.given_name,
  last_name: profile.family_name,
  picture: profile.picture && profile.picture.data,
  auth_type: "facebook",
  auth_id: profile.id,
});

async function verifyMobile({ models, publisherUser, accessToken }) {
  assert(models);
  assert(accessToken);
  log.debug("verifyMobile ");
  const getMe = () =>
    axios
      .get("me", {
        params: {
          fields: "name,email,picture,first_name,last_name",
          access_token: accessToken,
        },
      })
      .then((res) => {
        log.debug("verifyMobile fb me: ", JSON.stringify(res.data, null, 4));
        return res;
      })
      .then((res) => profileMobileToUser(res.data));

  return createVerifyMobile({ getMe, models, publisherUser, accessToken });
}

module.exports.verifyMobile = verifyMobile;

function registerWeb({ passport, models, publisherUser }) {
  assert(models);
  let authenticationFbConfig = config.authentication.facebook;
  if (authenticationFbConfig && !_.isEmpty(authenticationFbConfig.clientID)) {
    log.info("configuring facebook authentication strategy");
    let facebookStrategy = new FbWebStrategy(
      {
        ...authenticationFbConfig,
        profileFields: [
          "id",
          "email",
          "picture",

          "gender",
          "link",
          "locale",
          "name",
          "timezone",
        ],
        enableProof: false,
      },
      async function (req, _, { access_token }, profile, done) {
        try {
          //refreshToken;
          log.info("registerWeb ", JSON.stringify(profile, null, 4));
          let res = await verifyWeb({
            models,
            publisherUser,
            userConfig: profileToUser(profile._json, access_token),
          });
          done(res.err, res.user);
        } catch (err) {
          done(err);
        }
      }
    );
    passport.use("facebook", facebookStrategy);
  }
}

function registerMobile({ passport, models, publisherUser }) {
  assert(models);
  createRegisterMobile({
    name: "facebook",
    verifyMobile,
    passport,
    models,
    publisherUser,
  });
}

exports.registerWeb = registerWeb;
exports.registerMobile = registerMobile;
