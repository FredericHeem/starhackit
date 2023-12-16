const assert = require("assert");
const { pipe, tap } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { S3Client } = require("@aws-sdk/client-s3");

exports.createS3Client = (env) =>
  pipe([
    tap((params) => {
      assert(env);
      assert(env.S3_AWS_REGION);
    }),
    () => ({ region: env.S3_AWS_REGION }),
    when(
      () => env.S3_AWSAccessKeyId,
      defaultsDeep({
        credentials: {
          accessKeyId: env.S3_AWSAccessKeyId,
          secretAccessKey: env.S3_AWSSecretKey,
        },
      })
    ),
    (params) => new S3Client(params),
  ])();
