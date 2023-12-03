const assert = require("assert");
const { pipe, tap } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { ECSClient } = require("@aws-sdk/client-ecs");

exports.createECSClient = (env) =>
  pipe([
    tap((params) => {
      assert(env);
      assert(env.AWS_REGION);
    }),
    () => ({ region: env.AWS_REGION }),
    when(
      () => env.AWSAccessKeyId,
      defaultsDeep({
        credentials: {
          accessKeyId: env.AWSAccessKeyId,
          secretAccessKey: env.AWSSecretKey,
        },
      })
    ),
    (params) => new ECSClient(params),
  ])();
