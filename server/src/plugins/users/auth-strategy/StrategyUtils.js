const { Strategy } = require("passport-local");

const log = require("logfilename")(__filename);

function createRegisterMobile(
  name,
  verifyMobile,
  passport,
  models,
  publisherUser
) {
  log.debug(`createRegisterMobile  ${name}`);
  const strategy = new Strategy(
    {
      usernameField: "userId",
      passwordField: "token",
      passReqToCallback: false,
    },
    async function (userID, token, done) {
      try {
        let res = await verifyMobile(models, publisherUser, userID, token);
        done(res.error, res.user);
      } catch (err) {
        done(err);
      }
    }
  );
  passport.use(`${name}_mobile`, strategy);
}

async function verifyWeb(models, publisherUser, userConfig) {
  log.debug(`verifyWeb`, JSON.stringify(userConfig, null, 4));
  const userByEmail = await models.User.findByEmail(userConfig.email);

  if (userByEmail) {
    log.debug("email already registered ");
    await models.User.update(userConfig, {
      where: { email: userConfig.email },
    });
    const userUpdated = await models.User.findByEmail(userConfig.email);
    log.debug("updated ", JSON.stringify(userUpdated.get(), null, 4));
    return {
      user: userUpdated.toJSON(),
    };
  }
  log.debug("creating user: ", userConfig);
  let user = await models.User.createUserInGroups(userConfig, ["User"]);
  let userCreated = user.toJSON();

  log.debug("register created new user ", userCreated);
  if (publisherUser) {
    await publisherUser.publish("user.registered", JSON.stringify(userCreated));
  }
  return {
    user: userCreated,
  };
}
module.exports.verifyWeb = verifyWeb;

async function createVerifyMobile(getMe, models, publisherUser, accessToken) {
  log.debug("createVerifyMobile ", accessToken);

  try {
    const profile = await getMe();
    log.debug("profile ", JSON.stringify(profile, null, 4));
    return verifyWeb(models, publisherUser, profile);
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
