const FbWebStrategy = require("passport-facebook").Strategy;
import {
  createRegisterMobile,
  createVerifyMobile,
  verifyWeb
} from "./StrategyUtils";

import config from "config";
import Axios from "axios";

const log = require("logfilename")(__filename);

const axios = Axios.create({
  baseURL: "https://graph.facebook.com/",
  timeout: 30e3
});

const profileToUser = profile => ({
  username: `${profile.first_name} ${profile.middle_name &&
    profile.middle_name} ${profile.last_name}`,
  email: profile.email,
  firstName: profile.first_name,
  lastName: profile.last_name,
  picture: profile.picture && profile.picture.data,
  authProvider: {
    name: "facebook",
    authId: profile.id
  }
});

const profileMobileToUser = profile => ({
  username: profile.name,
  email: profile.email,
  firstName: profile.given_name,
  lastName: profile.family_name,
  picture: profile.picture && profile.picture.data,
  authProvider: {
    name: "facebook",
    authId: profile.id
  }
});

export async function verifyMobile(
  models,
  publisherUser,
  profile,
  accessToken
) {
  log.info("verifyMobile ", JSON.stringify(profile, null, 4));
  const getMe = () =>
    axios
      .get("me", {
        params: {
          fields: "name,email,picture,first_name,last_name",
          access_token: accessToken
        }
      })
      .then(res => {
        log.debug("verifyMobile me: ", JSON.stringify(res.data, null, 4));
        return res;
      })
      .then(res => profileMobileToUser(res.data));

  return createVerifyMobile(getMe, models, publisherUser, accessToken);
}

export function registerWeb(passport, models, publisherUser) {
  let authenticationFbConfig = config.authentication.facebook;
  if (authenticationFbConfig && authenticationFbConfig.clientID) {
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
          "timezone"
        ],
        enableProof: false
      },
      async function(req, accessToken, refreshToken, profile, done) {
        try {
          log.info("registerWeb ", JSON.stringify(profile, null, 4));
          let res = await verifyWeb(
            models,
            publisherUser,
            profileToUser(profile._json),
            accessToken
          );
          done(res.err, res.user);
        } catch (err) {
          done(err);
        }
      }
    );
    passport.use("facebook", facebookStrategy);
  }
}

export function registerMobile(passport, models, publisherUser) {
  createRegisterMobile(
    "facebook",
    verifyMobile,
    passport,
    models,
    publisherUser
  );
}

/*
const savePicture = async ({ models, user, fbId, token }) => {
  try {
    const result = await axios.get(`${fbId}/picture`, {
      params: {
        redirect: false,
        type: "large",
        height: 480,
        access_token: token
      }
    });
    log.debug("picture ", result.data);
    const picture = _.get(result.data, "data");

    await models.User.update({ picture }, { where: { id: user.id } });
  } catch (error) {
    log.error("savePicture ", error);
    throw error;
  }
};
*/
