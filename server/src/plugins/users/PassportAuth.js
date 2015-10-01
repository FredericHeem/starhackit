var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('config');

module.exports = function(app) {
  "use strict";
  var log = require('logfilename')(__filename);
  var models = app.data.sequelize.models;
  var authenticationFbConfig = config.authentication.facebook;
  if (authenticationFbConfig && authenticationFbConfig.clientID) {
    log.info("configuring facebook authentication strategy");
    var facebookStrategy = new FacebookStrategy(
    {
      clientID: authenticationFbConfig.clientID,
      clientSecret: authenticationFbConfig.clientSecret,
      callbackURL: authenticationFbConfig.callbackURL,
      profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
      enableProof: false
    },
    function(req, accessToken, refreshToken, profile, done) {
      log.debug("authentication reply from fb");
      //log.debug(accessToken);
      //log.debug(profile);

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
            models.User.find({where:{username: profile._json.email}})
            .then(function(user) {
              if (user) {
                log.debug("email already registered");
                //should update fb profile id
                done(null, user.get());
              } else {
                //Create user
                var userConfig = {
                  username: profile._json.email,
                  facebookId: profile.id
                };
                models.User.createUserInGroups(userConfig, ["User"])
                .then(function(res) {
                  var userCreated = res.toJSON();
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
    });
    passport.use('facebook', facebookStrategy);
  }

  var loginStrategy = new LocalStrategy(
      function(username, password, done) {
        log.debug("loginStrategy username: ", username);
        models.User.find({where:{username:username}})
        .then(function(user) {

          if (!user) {
            log.info("userBasic invalid username user: ", username);
            return done(null, false, {message: 'InvalidUsernameOrPassword'});
          }
          //log.info("userBasic user: ", user.get());
          user.comparePassword(password)
          .then(function(result) {
            if (result) {
              log.debug("userBasic valid password for user: ", user.toJSON());
              return done(null, user.toJSON());
            } else {
              log.info("userBasic invalid password user: ", user.get());
              return done(null, false, {message: 'InvalidUsernameOrPassword'});
            }
          });
        })
        .catch(done);
      }
  );

  var registerStrategy = new LocalStrategy(
      {
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
      },
      function(req, username, password, done) {
        log.info("registerStrategy username: ", username);
        models.User.find({where:{username:username}})
        .then(function(user) {
          if (!user) {
            log.info("register create new user");
            //return done(null, false, { message: 'InvalidUsernameOrPassword'});
            var userConfig = {
              username: username,
              password: password
            };
            models.User.createUserInGroups(userConfig, ["User"])
            .then(function(res) {
              var userCreated = res.toJSON();
              log.info("register created new user ", userCreated);
              done(null, {});
            })
            .then(done, done);
          } else {
            log.info("already registered", username);
            done(null, {});
          }
        })
        .catch(done);
      }
  );

  passport.use('login', loginStrategy);
  passport.use('register', registerStrategy);

  passport.serializeUser(function(user, done) {
    log.debug("serializeUser ", user);
    //TODO use redis
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    log.debug("deserializeUser ", id);
    //TODO use redis
    done(null, id);
  });

  function ensureAuthenticated(req, res, next) {
    log.info("ensureAuthenticated ", req.url);
    if (!req.isAuthenticated()) {
      log.info("ensureAuthenticated KO: ", req.url);
      return res.status(401).send("Unauthorized");
    }

    return next();
  }

  function isAuthorized(req, res, next) {
    if (!req.user) {
      return next({error:"UserNotSet"});
    }
    var routePath = req.route.path;
    var userId = req.user.id;
    log.info("isAuthorized: who:%s, resource:%s, method %s", userId, routePath, req.method);

    models.User.checkUserPermission(userId, routePath, req.method)
    .then(function(authorized) {
      log.info("isAuthorized ", authorized);
      if (authorized) {
        next();
      } else {
        res.status(401).send();
      }
    });
  }

  return {
    ensureAuthenticated:ensureAuthenticated,
    isAuthorized:isAuthorized
  };
};
