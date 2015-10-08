import {Strategy as LocalStrategy} from 'passport-local';
let log = require('logfilename')(__filename);

export async function verifyLogin(models, username, password) {
  log.debug("loginStrategy username: ", username);
  let user = await models.User.find({
    where: {
      username: username
    }
  });
  if (!user) {
    log.info("userBasic invalid username user: ", username);
    return {
      error: {
        message: 'InvalidUsernameOrPassword'
      }
    };
  }
  //log.info("userBasic user: ", user.get());
  let result = await user.comparePassword(password);
  if (result) {
    log.debug("userBasic valid password for user: ", user.toJSON());
    return {
      user: user.toJSON()
    };
  } else {
    log.info("userBasic invalid password user: ", user.get());
    return {
      error: {
        message: 'InvalidUsernameOrPassword'
      }
    };
  }
}

export async function verifyRegister(models, req, username, password) {
  log.info("verifyRegister username: ", username);
  let user = await models.User.find({
    where: {
      username: username
    }
  });

  if (user) {
    log.info("already registered", username);
    return {
      user: {
      }
    };
  }

  log.info("register create new user ", req.body);
  //return done(null, false, { message: 'InvalidUsernameOrPassword'});
  let userConfig = {
    username: username,
    password: password,
    email: req.body.email
  };

  let res = await models.User.createUserInGroups(userConfig, ["User"]);
  let userCreated = res.toJSON();
  log.info("register created new user ", userCreated);
  return {
    user: userCreated
  };
}

export function register(passport, models) {
  let loginStrategy = new LocalStrategy(
    async function (username, password, done) {
      try {
        let res = await verifyLogin(models, username, password);
        done(res.err, res.user);
      } catch (err) {
        done(err);
      }
    }
  );

  let registerStrategy = new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    async function (req, username, password, done) {
      try {
        let res = await verifyRegister(models, req, username, password);
        done(res.err, res.user);
      } catch (err) {
        done(err);
      }
    }
  );

  passport.use('login', loginStrategy);
  passport.use('register', registerStrategy);
};
