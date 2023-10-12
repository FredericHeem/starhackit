const { pipe, tap, assign, get } = require("rubico");
const { when, defaultsDeep } = require("rubico/x");

exports.transformEnv = pipe([
  defaultsDeep({
    S3_AWSAccessKeyId: process.env.S3_AWSAccessKeyId,
    S3_AWSSecretKey: process.env.S3_AWSSecretKey,
    S3_AWS_REGION: process.env.S3_AWS_REGION,
  }),
  when(
    get("GOOGLE_CREDENTIALS"),
    assign({
      GOOGLE_CREDENTIALS: pipe([get("GOOGLE_CREDENTIALS"), JSON.stringify]),
    })
  ),
]);
