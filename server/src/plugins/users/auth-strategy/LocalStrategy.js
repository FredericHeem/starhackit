import {Strategy as LocalStrategy} from 'passport-local';
let log = require('logfilename')(__filename);

export async function verifyLogin(models, username, password) {
  log.debug("loginStrategy username: ", username);
  let user = await models.User.findByUsernameOrEmail(username);
  if (!user) {
    log.info("userBasic invalid username user: ", username);
    return {
      error: {
        message: 'Username and Password do not match'
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
        message: 'Username and Password do not match'
      }
    };
  }
}


export default function register(passport, models) {
  log.debug("register");
  let loginStrategy = new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: false
    },
    async function (username, password, done) {
      try {
        let res = await verifyLogin(models, username, password);
        done(res.error, res.user);
      } catch (err) {
        done(err);
      }
    }
  );

  passport.use('local', loginStrategy);
};
