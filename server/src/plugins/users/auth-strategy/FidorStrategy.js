import uri from 'url';
let FidorStrategy = require('passport-oauth2').Strategy;
let config = require('config');

let log = require('logfilename')(__filename);


FidorStrategy.prototype.userProfile = function(accessToken, done) {
  log.debug(`userProfile accessToken: ${accessToken}`);
  let url = uri.parse(this._profileURL);
  log.debug(`profileURL ${this._profileURL}`);

  url = uri.format(url);

  this._oauth2.get(url, accessToken, function (err, body) {
    let json;
    log.debug(`err ${JSON.stringify(err)}`);
    log.debug(`body ${body}`);
    if (err) {
      if (err.data) {
        try {
          json = JSON.parse(err.data);
        } catch (_) {}
      }

      return done(new Error('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    done(null, json);
  });
};

export async function verify(models, publisherUser, accessToken, refreshToken, profile) {
  log.debug(`verify accessToken: ${accessToken} refreshToken: ${refreshToken}`);
  //log.debug(accessToken);
  log.debug(JSON.stringify(profile, null, 4));

  let user = await models.User.find({
    where: {
      fidorId: profile.id
    }
  });

  if (user) {
    log.debug("user already exist: ", user.toJSON());
    return {
      user: user.toJSON()
    };
  }

  log.debug("no profile registered");
  let userByEmail = await models.User.find({
    where: {
      email: profile.email
    }
  });

  if (userByEmail) {
    log.debug("email already registered");
    //should update profile id
    return {
      user: userByEmail.toJSON()
    };
  }

  //Create user
  let userConfig = {
    username: profile.email,
    email: profile.email,
    fidorId: profile.id
  };
  log.debug("creating user: ", userConfig);
  user = await models.User.createUserInGroups(userConfig, ["User"]);
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

  let authConfig = config.authentication.fidor;
  if (authConfig && authConfig.clientID) {
    log.info("configuring fidor authentication strategy");
    let strategy = new FidorStrategy(authConfig,
      async function (accessToken, refreshToken, profile, done) {
        try {
          let res = await verify(models, publisherUser, accessToken, refreshToken, profile);
          //Save it to redis
          res.user.accessToken = accessToken;
          done(res.err, res.user);
        } catch(err){
          done(err);
        }
      });
    strategy._profileURL = authConfig.profileURL;
    strategy._oauth2.useAuthorizationHeaderforGET(true);
    passport.use('fidor', strategy);
  }
};
