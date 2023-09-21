const assert = require("assert");
const _ = require("lodash");
const GitHubStrategy = require("passport-github").Strategy;
const { verifyWeb } = require("./StrategyUtils");

//TODO
const config = require("config");

const log = require("logfilename")(__filename);

const profileToUser = (profile) => ({
  username: profile.name,
  picture: { url: profile.avatar_url },
  email: profile.email,
  auth_type: "github",
  auth_id: profile.id,
});

function registerWeb({ passport, models, publisherUser }) {
  assert(models);
  let authenticationGHConfig = config.authentication.github;
  if (authenticationGHConfig && !_.isEmpty(authenticationGHConfig.clientID)) {
    log.info("configuring github authentication strategy");
    let githubStrategy = new GitHubStrategy(
      {
        ...authenticationGHConfig,
      },
      async function (_accessToken, _refreshToken, params, profile, done) {
        try {
          log.info("registerWeb ", JSON.stringify(profile, null, 4));
          let res = await verifyWeb({
            models,
            publisherUser,
            userConfig: profileToUser(profile._json),
          });
          done(res.err, { ...params, ...res.user });
        } catch (err) {
          done(err);
        }
      }
    );
    passport.use("github", githubStrategy);
  }
}

exports.registerWeb = registerWeb;
