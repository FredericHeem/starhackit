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
    let user = await models.User.findOne({
      where: {
        id: jwtPayload.id
      }
    });

    if (!user) {
      log.info("findUser no user");
      done(null);
    } else {
      log.info("findUser ", user.get());
      done(null, user.get());
    }
  });

  passport.use('jwt', strategy);
};

module.exports = register;