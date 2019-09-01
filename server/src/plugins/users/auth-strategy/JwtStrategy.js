const passportJwt = require("passport-jwt");
const {Strategy, ExtractJwt} = passportJwt;
//TODO config
const config = require('config');

let log = require('logfilename')(__filename);

function register(passport, models) {
  log.debug("register");

  //More options at https://github.com/themikenicholson/passport-jwt#configure-strategy
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    secretOrKey: config.jwt.secret || 'secret',
    jsonWebTokenOptions: config.jwt.options
  };

  let strategy = new Strategy(opts, async (jwtPayload, done) => {
    log.debug("findUser: ", jwtPayload);

    if (!jwtPayload) {
      log.info("findUser no user");
      done(null);
    } else {
      log.info("findUser ", jwtPayload);
      done(null, jwtPayload);
    }
  });

  passport.use('jwt', strategy);
};

module.exports = register;