const assert = require("assert");
const _ = require("lodash");
const GitLabStrategy = require("passport-gitlab2").Strategy;
const { verifyWeb } = require("./StrategyUtils");

//TODO
const config = require("config");

const log = require("logfilename")(__filename);

const profileToUser = (profile) => ({
  username: profile.username,
  display_name: profile.name,
  picture: { url: profile.avatar_url },
  email: profile.email,
  auth_type: "gitlab",
  auth_id: profile.id,
});

function registerWeb({ passport, models, publisherUser }) {
  assert(passport);
  assert(models);
  let authenticationGHConfig = config.authentication.gitlab;
  if (authenticationGHConfig && !_.isEmpty(authenticationGHConfig.clientID)) {
    log.info("configuring gitlab authentication strategy");
    let gitlabStrategy = new GitLabStrategy(
      {
        ...authenticationGHConfig,
      },
      async function (_accessToken, _refreshToken, params, profile, done) {
        try {
          log.debug("registerWeb ", JSON.stringify(profile, null, 4));
          const userConfig = profileToUser(profile._json);
          let res = await verifyWeb({
            models,
            publisherUser,
            userConfig,
          });
          done(res.err, { ...params, ...res.user });
        } catch (err) {
          done(err);
        }
      }
    );
    passport.use("gitlab", gitlabStrategy);
  }
}

exports.registerWeb = registerWeb;
