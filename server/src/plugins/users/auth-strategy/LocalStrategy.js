let LocalStrategy = require('passport-local').Strategy;
let log = require('logfilename')(__filename);

export function verifyLogin(models, username, password, done){
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

export function verifyRegister(models, req, username, password, done){
  log.info("registerStrategy username: ", username);
  models.User.find({where: {username: username}})
  .then(function(user) {
    if (!user) {
      log.info("register create new user ", req.body);
      //return done(null, false, { message: 'InvalidUsernameOrPassword'});
      let userConfig = {
        username: username,
        password: password,
        email:req.body.email
      };
      models.User.createUserInGroups(userConfig, ["User"])
      .then(function(res) {
        let userCreated = res.toJSON();
        log.info("register created new user ", userCreated);
        done(null, userCreated);
      })
      .then(done, done);
    } else {
      log.info("already registered", username);
      done(null, {});
    }
  })
  .catch(done);
}

export function register(passport, models) {
  let loginStrategy = new LocalStrategy(
      function(username, password, done) {
        verifyLogin(models, username, password, done);
      }
  );

  let registerStrategy = new LocalStrategy(
      {
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
      },
      function(req, username, password, done) {
        verifyRegister(models, req, username, password, done);
      }
  );

  passport.use('login', loginStrategy);
  passport.use('register', registerStrategy);
};
