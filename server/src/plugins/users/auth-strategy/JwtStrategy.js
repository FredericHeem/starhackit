import {Strategy, ExtractJwt} from 'passport-jwt';
let log = require('logfilename')(__filename);

export default function register(passport, models) {
  log.debug("register");

  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('Bearer');
  opts.secretOrKey = 'secret';
  //opts.issuer = "accounts.examplesoft.com";
  //opts.audience = "yoursite.net";

  let strategy = new Strategy(opts, async (jwtPayload, done) => {
    log.debug("findUser: ", jwtPayload);
    let user = await models.User.find({
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
