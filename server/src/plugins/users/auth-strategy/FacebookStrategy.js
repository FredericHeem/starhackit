const FbWebStrategy = require("passport-facebook").Strategy;
const FbMobileStrategy = require("passport-local").Strategy;

import config from "config";
import Axios from "axios";
import _ from "lodash";

let log = require("logfilename")(__filename);

const axios = Axios.create({
  baseURL: "https://graph.facebook.com/",
  timeout: 30e3
});

const profileToUser = profile => ({
  username: `${profile.first_name} ${profile.middle_name} ${profile.last_name}`,
  email: profile.email,
  firstName: profile.first_name,
  lastName: profile.last_name,
  picture: profile.picture && profile.picture.data,
  authProvider: {
    name: "facebook",
    authId: profile.id
  }
});

const createUser = async (userConfig, models, publisherUser) => {
  log.debug("creating user: ", userConfig);
  let user = await models.User.createUserInGroups(userConfig, ["User"]);
  let userCreated = user.toJSON();

  log.info("register created new user ", userCreated);
  if (publisherUser) {
    await publisherUser.publish("user.registered", JSON.stringify(userCreated));
  }
  return userCreated;
};
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

export async function verifyWeb(
  models,
  publisherUser,
  req,
  accessToken,
  refreshToken,
  profile
) {
  log.debug("authentication reply from fb");
  log.debug(JSON.stringify(profile, null, 4));

  let authProvider = await models.AuthProvider.find({
    where: {
      name: "facebook",
      authId: profile.id
    }
  });

  if (authProvider) {
    log.debug("user already exist: auth ", authProvider.toJSON());
    let user = await models.User.findByUserId(authProvider.get().user_id);
    //log.debug("user already exist: user ", user.toJSON());
    return {
      fbId: profile.id,
      user: user.toJSON()
    };
  }

  log.debug("no fb profile registered");
  let userByEmail = await models.User.findByEmail(profile._json.email);

  if (userByEmail) {
    log.debug("email already registered");
    //should update fb profile id
    return {
      fbId: profile.id,
      user: userByEmail.toJSON()
    };
  }

  const userCreated = await createUser(
    profileToUser(profile._json),
    models,
    publisherUser
  );

  //await savePicture({ models, user: userCreated, fbId: profile.id, accessToken });
  return {
    fbId: profile.id,
    user: userCreated
  };
}

export async function verifyMobile(models, publisherUser, userID, access_token) {
  log.debug("verifyLogin ", access_token);

  try {
    const result = await axios.get("me", {
      params: {
        fields: "name,email,picture,first_name,last_name",
        access_token
      }
    });
    const profile = result.data;
    log.debug("profile ", profile);
    return verifyWeb(models, publisherUser, null, access_token, "", profile);
  } catch (error) {
    log.error("loginFacebook ", error);
    return {
      error: {
        message: "InvalidToken"
      }
    };
  }
}

export function registerWeb(passport, models, publisherUser) {
  let authenticationFbConfig = config.authentication.facebook;
  if (authenticationFbConfig && authenticationFbConfig.clientID) {
    log.info("configuring facebook authentication strategy");
    let facebookStrategy = new FbWebStrategy(
      {
        clientID: authenticationFbConfig.clientID,
        clientSecret: authenticationFbConfig.clientSecret,
        callbackURL: authenticationFbConfig.callbackURL,
        profileFields: [
          "id",
          "email",
          "picture",
          "gender",
          "link",
          "locale",
          "name",
          "timezone",
          "updated_time",
          "verified"
        ],
        enableProof: false
      },
      async function(req, accessToken, refreshToken, profile, done) {
        try {
          let res = await verifyWeb(
            models,
            publisherUser,
            req,
            accessToken,
            refreshToken,
            profile
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
  log.info("configuring facebook mobile authentication strategy");
  let fbMobileStrategy = new FbMobileStrategy(
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
  passport.use("facebook_mobile", fbMobileStrategy);
}
