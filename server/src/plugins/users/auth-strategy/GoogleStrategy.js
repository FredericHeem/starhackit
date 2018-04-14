import { Strategy } from "passport-google-oauth20";
import config from "config";

const log = require("logfilename")(__filename);

export async function verify(
  models,
  publisherUser,
  accessToken,
  refreshToken,
  profile
) {
  log.debug(`authentication reply from google ${profile}`, profile);
  log.debug(JSON.stringify(profile, null, 4));

  const userByEmail = await models.User.findByEmail(profile.emails[0].value);

  if (userByEmail) {
    log.debug("email already registered ");
    //should update fb profile id
    return {
      user: userByEmail.toJSON()
    };
  }

  //Create user
  let userConfig = {
    username: profile.displayName,
    email: profile.emails[0].value,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    picture: {
      url: profile.photos[0].value
    },
    authProvider: {
      name: "google",
      authId: profile.id
    }
  };
  log.debug("creating user: ", userConfig);
  let user = await models.User.createUserInGroups(userConfig, ["User"]);
  let userCreated = user.toJSON();

  log.info("register created new user ", userCreated);
  if (publisherUser) {
    console.log("publisherUser", publisherUser);
    await publisherUser.publish("user.registered", JSON.stringify(userCreated));
  }
  return {
    user: userCreated
  };
}

export function register(passport, models, publisherUser) {
  const googleConfig = config.authentication.google;
  if (googleConfig) {
    log.info("configuring linkined authentication strategy");
    const strategy = new Strategy(googleConfig, async function(
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      try {
        const res = await verify(
          models,
          publisherUser,
          accessToken,
          refreshToken,
          profile
        );
        done(res.err, res.user);
      } catch (err) {
        done(err);
      }
    });
    passport.use("google", strategy);
  }
}
