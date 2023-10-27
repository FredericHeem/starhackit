const assert = require("assert");
const { Strategy } = require("passport-local");
const { pick } = require("rubico");
const log = require("logfilename")(__filename);

function createRegisterMobile({
  name,
  verifyMobile,
  passport,
  models,
  publisherUser,
}) {
  log.debug(`createRegisterMobile  ${name}`);
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
const userAttributes = [
  "email",
  "user_id",
  "username",
  "picture",
  "display_name",
];
async function verifyWeb({ models, publisherUser, userConfig }) {
  assert(userConfig);
  assert(models);
  log.debug(`verifyWeb`, JSON.stringify(userConfig, null, 4));
  const userByEmail = await models.user.findOne({
    attributes: ["email"],
    where: { email: userConfig.email },
  });
  if (userByEmail) {
    log.debug("email already registered ");
    await models.user.update({
      data: pick(userAttributes)(userConfig),
      where: { email: userConfig.email },
    });
    const userUpdated = await models.user.findOne({
      attributes: userAttributes,
      where: { email: userConfig.email },
    });
    return {
      user: userUpdated,
    };
  } else {
    log.debug("creating user: ", userConfig);
    let userCreated = await models.user.insert(userConfig);

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
  publisherUser,
  accessToken,
}) {
  assert(getMe);
  assert(accessToken);
  log.debug("createVerifyMobile ");

  try {
    const userConfig = await getMe();
    log.debug("profile ", JSON.stringify(profile, null, 4));
    return verifyWeb({ models, publisherUser, userConfig });
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
