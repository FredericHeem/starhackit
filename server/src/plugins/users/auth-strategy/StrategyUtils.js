import { Strategy } from "passport-local";

const log = require("logfilename")(__filename);

export function createRegisterMobile(
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
      passReqToCallback: false
    },
    async function(userID, token, done) {
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

export async function verifyWeb(
  models,
  publisherUser,
  userConfig,
  accessToken
) {
  log.debug(`verifyWeb  ${accessToken}`, JSON.stringify(userConfig, null, 4));
  log.debug("verifyWeb email", userConfig.email);
  const userByEmail = await models.User.findByEmail(userConfig.email);

  if (userByEmail) {
    log.debug("email already registered ");
    //should update fb profile id
    return {
      user: userByEmail.toJSON()
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
    user: userCreated
  };
}

export async function createVerifyMobile(
  getMe,
  models,
  publisherUser,
  userID,
  accessToken
) {
  log.debug("verifyLogin ", accessToken);

  try {
    const result = await getMe();
    const profile = result.data;
    log.debug("profile ", profile);
    return verifyWeb(models, publisherUser, profile, accessToken);
  } catch (error) {
    log.error("verifyMobile ", error);
    return {
      error: {
        message: "InvalidToken"
      }
    };
  }
}
