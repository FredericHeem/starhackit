const assert = require("assert");
const { Strategy } = require("passport-local");

const log = require("logfilename")(__filename);

function createRegisterMobile({
  name,
  verifyMobile,
  passport,
  models,
  sql,
  publisherUser,
}) {
  log.debug(`createRegisterMobile  ${name}`);
  assert(sql);
  assert(name);
  assert(verifyMobile);
  const strategy = new Strategy(
    {
      usernameField: "userId",
      passwordField: "token",
      passReqToCallback: false,
    },
    async function (profile, accessToken, done) {
      try {
        let res = await verifyMobile({
          models,
          sql,
          publisherUser,
          profile,
          accessToken,
        });
        done(res.error, res.user);
      } catch (err) {
        done(err);
      }
    }
  );
  passport.use(`${name}_mobile`, strategy);
}

async function verifyWeb({ sql, models, publisherUser, userConfig }) {
  assert(userConfig);
  assert(models);
  assert(sql);
  log.debug(`verifyWeb`, JSON.stringify(userConfig, null, 4));
  const userByEmail = await sql.user.findOne({
    attributes: ["email"],
    where: { email: userConfig.email },
  });
  if (userByEmail) {
    log.debug("email already registered ");
    // TODO
    await sql.user.update({
      data: userConfig,
      where: { email: userConfig.email },
    });
    const userUpdated = await sql.user.findOne({
      attributes: ["*"],
      where: { email: userConfig.email },
    });
    return {
      user: userUpdated,
    };
  } else {
    log.debug("creating user: ", userConfig);
    let userCreated = await sql.user.insert(userConfig);

    log.debug("register created new user ", userCreated);
    if (publisherUser) {
      await publisherUser.publish(
        "user.registered",
        JSON.stringify(userCreated)
      );
    }
    return {
      user: userCreated,
    };
  }
}
module.exports.verifyWeb = verifyWeb;

async function createVerifyMobile({
  getMe,
  models,
  sql,
  publisherUser,
  accessToken,
}) {
  assert(getMe);
  assert(sql);
  assert(accessToken);
  log.debug("createVerifyMobile ");

  try {
    const userConfig = await getMe();
    log.debug("profile ", JSON.stringify(profile, null, 4));
    return verifyWeb({ models, sql, publisherUser, userConfig });
  } catch (error) {
    log.error("verifyMobile ", error);
    return {
      error: {
        message: "InvalidToken",
      },
    };
  }
}
module.exports.createVerifyMobile = createVerifyMobile;
exports.createRegisterMobile = createRegisterMobile;
