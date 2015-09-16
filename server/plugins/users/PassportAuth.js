var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){
  "use strict";
  var log = require('logfilename')(__filename);
  var models = app.data.sequelize.models;
  
  var loginStrategy = new LocalStrategy(
      function(username, password, done) {
        log.debug("loginStrategy username: ", username);
        models.user.find({where:{username:username}})
        .then(function(user){
          
          if(!user) {
            log.info("userBasic invalid username user: ", username);
            return done(null, false, { message: 'InvalidUsernameOrPassword'});
          }
          //log.info("userBasic user: ", user.get());
          user.comparePassword(password)
          .then(function(result){
            if(result){
              log.debug("userBasic valid password for user: ", user.toJSON());
              return done(null, user.toJSON());
            } else {
              log.info("userBasic invalid password user: ", user.get());
              return done(null, false, { message: 'InvalidUsernameOrPassword'});
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
        models.user.find({where:{username:username}})
        .then(function(user){
          if(!user) {
            log.info("register create new user");
            //return done(null, false, { message: 'InvalidUsernameOrPassword'});
            var userConfig = {
                username: username,
                password: password
            };
            models.user.createUserInGroups(userConfig, ["User"])
            .then(function(res){
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
    if(!req.isAuthenticated()){
      log.info("ensureAuthenticated KO: ", req.url);
      return res.status(401).send("Unauthorized");
    }
    
    return next();
  }
  
  function isAuthorized(req, res, next) {
    if(!req.user){
      return next({error:"UserNotSet"});
    }
    var routePath = req.route.path;
    var userId = req.user.id;
    log.info("isAuthorized: who:%s, resource:%s, method %s", userId, routePath, req.method);
    
    models.user.checkUserPermission(userId, routePath, req.method)
    .then(function(authorized){
      log.info("isAuthorized ", authorized);
      if(authorized){
        next();
      } else {
        res.status(401).send();
      }
    });
  }
  
  return {
    ensureAuthenticated:ensureAuthenticated,
    isAuthorized:isAuthorized,
    passport:passport
  };
};