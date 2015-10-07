let FacebookStrategy = require('passport-facebook').Strategy;
let config = require('config');

let log = require('logfilename')(__filename);

export function verify(models, req, accessToken, refreshToken, profile, done){
  log.debug("authentication reply from fb");
  //log.debug(accessToken);
  log.debug(JSON.stringify(profile, null, 4));

  if (req.user) {
    log.error("TODO");
    done(null, req.user);
  } else {
    models.User.find({where:{facebookId: profile.id}})
    .then(function(user) {
      if (user) {
        log.debug("user already exist");
        return done(null, user.get());
      } else {
        log.debug("no fb profile registered");
        models.User.find({where:{email: profile._json.email}})
        .then(function(userByEmail) {
          if (userByEmail) {
            log.debug("email already registered");
            //should update fb profile id
            done(null, userByEmail.get());
          } else {
            //Create user
            let userConfig = {
              username: `${profile.name.givenName} ${profile.name.middleName} ${profile.name.familyName}`,
              email: profile._json.email,
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              facebookId: profile.id
            };
            log.debug("creating user: ", userConfig);
            models.User.createUserInGroups(userConfig, ["User"])
            .then(function(res) {
              let userCreated = res.toJSON();
              log.info("register created new user ", userCreated);
              done(null, userCreated);
            })
            .catch(done);
          }
        })
        .catch(done);
      }
    })
    .catch(done);
  }
}

export function register(passport, models) {

  let authenticationFbConfig = config.authentication.facebook;
  if (authenticationFbConfig && authenticationFbConfig.clientID) {
    log.info("configuring facebook authentication strategy");
    let facebookStrategy = new FacebookStrategy(
    {
      clientID: authenticationFbConfig.clientID,
      clientSecret: authenticationFbConfig.clientSecret,
      callbackURL: authenticationFbConfig.callbackURL,
      profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
      enableProof: false
    },
    function (req, accessToken, refreshToken, profile, done){
      verify(models, req, accessToken, refreshToken, profile, done);
    });
    passport.use('facebook', facebookStrategy);
  }
};
