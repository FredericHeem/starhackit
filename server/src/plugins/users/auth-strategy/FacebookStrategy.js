let FacebookStrategy = require('passport-facebook').Strategy;
let config = require('config');

let log = require('logfilename')(__filename);

export async function verify(models, publisherUser, req, accessToken, refreshToken, profile) {
  log.debug("authentication reply from fb");
  //log.debug(accessToken);
  log.debug(JSON.stringify(profile, null, 4));

  let authProvider = await models.AuthProvider.find({
    where: {
      name: 'facebook',
      authId: profile.id
    }
  });

  if (authProvider) {
    log.debug("user already exist: auth ", authProvider.toJSON());
    let user = await models.User.findByUserId(authProvider.get().user_id);
    //log.debug("user already exist: user ", user.toJSON());
    return {
      user: user.toJSON()
    };
  }

  log.debug("no fb profile registered");
  let userByEmail = await models.User.findByEmail(profile._json.email);

  if (userByEmail) {
    log.debug("email already registered");
    //should update fb profile id
    return {
      user: userByEmail.toJSON()
    };
  }

  //Create user
  let userConfig = {
    username: `${profile.name.givenName} ${profile.name.familyName}`,
    email: profile._json.email,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
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

  let authenticationFbConfig = config.authentication.facebook;
  if (authenticationFbConfig && authenticationFbConfig.clientID) {
    log.info("configuring facebook authentication strategy");
    let facebookStrategy = new FacebookStrategy({
        clientID: authenticationFbConfig.clientID,
        clientSecret: authenticationFbConfig.clientSecret,
        callbackURL: authenticationFbConfig.callbackURL,
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
        enableProof: false
      },
      async function (req, accessToken, refreshToken, profile, done) {
        try {
          let res = await verify(models, publisherUser, req, accessToken, refreshToken, profile);
          done(res.err, res.user);
        } catch(err){
          done(err);
        }
      });
    passport.use('facebook', facebookStrategy);
  }
};
