let FbMobileStrategy = require('passport-local').Strategy;
import Axios from 'axios';

let log = require('logfilename')(__filename);

export async function verifyLogin(models, publisherUser, userID, token){
  log.debug("verifyLogin ", token);

  const axios = Axios.create({
    baseURL: "https://graph.facebook.com/",
    timeout: 30e3
  });

  let profile;
  try {
    const result = await axios.get('me', {
        params: {
        fields: "name,email,first_name,last_name",
        access_token: token
      }
    });
    profile = result.data;
    log.debug("profile ", profile);
  } catch(error){
    log.error("loginFacebook ", error);
    return {
      error: {
        message: 'InvalidToken'
      }
    };
  }

  let authProvider = await models.AuthProvider.find({
    where: {
      name: 'facebook',
      authId: profile.id
    }
  });

  if (authProvider) {
    log.debug("user already exist: auth ", authProvider.toJSON());
    let user = await models.User.findByUserId(authProvider.get().user_id);
    return {
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
      name: 'facebook',
      authId: profile.id
    }
  };
  log.debug("creating user: ", userConfig);
  let user = await models.User.createUserInGroups(userConfig, ["User"]);
  let userCreated = user.toJSON();

  log.info("register created new user ", userCreated);
  if(publisherUser){
    await publisherUser.publish("user.registered", JSON.stringify(userCreated));
  }
  return {
    user: userCreated
  };
}

export function register(passport, models, publisherUser) {
  log.info("configuring facebook mobile authentication strategy");
  let fbMobileStrategy = new FbMobileStrategy({
      usernameField: 'userId',
      passwordField: 'token',
      passReqToCallback: false
    },
    async function (userID, token, done) {
      try {
        let res = await verifyLogin(models, publisherUser, userID, token);
        done(res.error, res.user);
      } catch (err) {
        done(err);
      }
    }
  );
  passport.use('facebook_mobile', fbMobileStrategy);
};
