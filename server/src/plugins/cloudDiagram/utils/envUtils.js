const { pipe, tap, assign, get, pick } = require("rubico");
const { when, defaultsDeep } = require("rubico/x");

const defaultEnv = [
  "S3_AWSAccessKeyId",
  "S3_AWSSecretKey",
  "S3_AWS_REGION",
  "GRUCLOUD_OAUTH_SERVER",
  "GRUCLOUD_OAUTH_CLIENT_SECRET",
  "AWS_OAUTH_AUDIENCE",
  "AZURE_OAUTH_AUDIENCE",
];

exports.transformEnv = ({ GRUCLOUD_OAUTH_SUBJECT }) =>
  pipe([
    defaultsDeep(pick(defaultEnv)(process.env)),
    defaultsDeep({ GRUCLOUD_OAUTH_SUBJECT }),
    when(
      get("GOOGLE_CREDENTIALS"),
      assign({
        GOOGLE_CREDENTIALS: pipe([get("GOOGLE_CREDENTIALS"), JSON.stringify]),
      })
    ),
  ]);
