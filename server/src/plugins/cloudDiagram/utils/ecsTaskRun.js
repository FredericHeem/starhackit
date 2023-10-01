const assert = require("assert");
const { pipe, tap, get, tryCatch } = require("rubico");
const { first } = require("rubico/x");

const { RunTaskCommand, ECSClient } = require("@aws-sdk/client-ecs");

const { AWSAccessKeyId, AWSSecretKey, AWS_REGION } = process.env;

const log = require("logfilename")(__filename);

exports.ecsTaskRun = ({}) =>
  tryCatch(
    pipe([
      tap(() => {
        log.debug(`ecsTaskRun`);
        assert(AWSAccessKeyId);
        assert(AWSSecretKey);
        assert(AWS_REGION);
      }),
      // TODO
      () => ({
        cluster: "grucloud-console-dev",
        taskDefinition: "grucloud-cli:9",
        launchType: "FARGATE",
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: ["subnet-b80a4ff5"],
            assignPublicIp: "ENABLED",
            securityGroups: ["sg-4e82a670"],
          },
        },
        overrides: {
          containerOverrides: [
            {
              name: "grucloud-cli",
              command: [
                "list",
                "--json",
                "grucloud-result.json",
                "-g",
                "--provider",
                "aws",
                "--s3-bucket",
                "grucloud-console-dev",
                "--s3-key",
                "my-org/my-project/my-workspace/run/1",
                // "--ws-url",
                // "ws://localhost:9000",
                // "--ws-room",
                // "my-org/my-project/my-workspace/run/1",
              ],
              environment: [
                { name: "AWSAccessKeyId", value: AWSAccessKeyId },
                { name: "AWSSecretKey", value: AWSSecretKey },
                { name: "AWS_REGION", value: AWS_REGION },
                { name: "CONTINUOUS_INTEGRATION", value: "1" },
              ],
            },
          ],
        },
      }),
      tap((taskArn) => {
        assert(taskArn);
      }),
      (input) => new RunTaskCommand(input),
      (command) => new ECSClient({ region: AWS_REGION }).send(command),
      tap((params) => {
        assert(params);
      }),
      get("tasks"),
      first,
      get("taskArn"),
      tap((taskArn) => {
        console.log(taskArn);
        assert(taskArn);
      }),
    ]),
    (error) => {
      throw error;
    }
  )();
