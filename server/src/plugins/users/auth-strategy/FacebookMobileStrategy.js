let FbMobileStrategy = require("passport-local").Strategy;
import Axios from "axios";
import _ from "lodash";

let log = require("logfilename")(__filename);

const axios = Axios.create({
  baseURL: "https://graph.facebook.com/",
  timeout: 30e3
});

export async function verifyLogin(models, publisherUser, userID, token) {
  log.debug("verifyLogin ", token);

  let profile;
  try {
    const result = await axios.get("me", {
      params: {
        fields: "name,email,first_name,last_name",
        access_token: token
      }
    });
    profile = result.data;
    log.debug("profile ", profile);
  } catch (error) {
    log.error("loginFacebook ", error);
    return {
      error: {
        message: "InvalidToken"
      }
    };
  }

  let authProvider = await models.AuthProvider.find({
    where: {
      name: "facebook",
      authId: profile.id
    }
  });

  if (authProvider) {
    log.debug("user already exist: auth ", authProvider.toJSON());
    let user = await models.User.findByUserId(authProvider.get().user_id);
    return {
      fbId: profile.id,
      user: user.toJSON()
    };
  }

  //Create user
  let userConfig = {
    username: profile.name,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    authProvider: {
      name: "facebook",
      authId: profile.id
    }
  };
  log.debug("creating user: ", userConfig);
  let user = await models.User.createUserInGroups(userConfig, ["User"]);
  let userCreated = user.toJSON();

  log.info("register created new user ", userCreated);
  if (publisherUser) {
    await publisherUser.publish("user.registered", JSON.stringify(userCreated));
  }
  return {
    fbId: profile.id,
    user: userCreated
  };
}

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

export function register(passport, models, publisherUser) {
  log.info("configuring facebook mobile authentication strategy");
  let fbMobileStrategy = new FbMobileStrategy(
    {
      usernameField: "userId",
      passwordField: "token",
      passReqToCallback: false
    },
    async function(userID, token, done) {
      try {
        let res = await verifyLogin(models, publisherUser, userID, token);
        if (res.user) {
          await savePicture({ models, user: res.user, fbId: res.fbId, token });
        }
        done(res.error, res.user);
      } catch (err) {
        done(err);
      }
    }
  );
  passport.use("facebook_mobile", fbMobileStrategy);
}
