import { Strategy } from "passport-google-oauth20";
import {
  createRegisterMobile,
  createVerifyMobile,
  verifyWeb
} from "./StrategyUtils";

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
  firstName: profile.given_name,
  lastName: profile.family_name,
  picture: {
    url: profile.picture
  },
  authProvider: {
    name: "google",
    authId: profile.id
  }
});

export async function verifyMobile(
  models,
  publisherUser,
  profile,
  accessToken
) {
  const getMe = () =>
    axios
      .get("userinfo/v2/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`
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
  const googleConfig = config.authentication.google;
  if (googleConfig) {
    const strategy = new Strategy(googleConfig, async function(
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      log.debug("registerWeb me: ", JSON.stringify(profile, null, 4));
      try {
        const res = await verifyWeb(
          models,
          publisherUser,
          profileWebToUser(profile._json),
          accessToken
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
  createRegisterMobile("google", verifyMobile, passport, models, publisherUser);
}
