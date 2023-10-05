const assert = require("assert");
const { pipe, tap, get, tryCatch, switchCase } = require("rubico");
const { first } = require("rubico/x");
const { inspect } = require("node:util");
const { RunTaskCommand, ECSClient } = require("@aws-sdk/client-ecs");

const { AWSAccessKeyId, AWSSecretKey, AWS_REGION } = process.env;

const log = require("logfilename")(__filename);

exports.ecsTaskRun = ({ config: { ecs }, container }) =>
  tryCatch(
    pipe([
      tap(() => {
        log.debug(
          `ecsTaskRun cluster: ${ecs.cluster}, taskDefinition: ${ecs.taskDefinition}, subnets: ${ecs.subnets}, securityGroups: ${ecs.securityGroups}`
        );
        assert(ecs);
        assert(ecs.cluster);
        assert(AWSAccessKeyId);
        assert(AWSSecretKey);
        assert(AWS_REGION);
      }),
      () => ({
        cluster: ecs.cluster,
        taskDefinition: ecs.taskDefinition,
        launchType: "FARGATE",
        networkConfiguration: {
          awsvpcConfiguration: {
            subnets: ecs.subnets,
            assignPublicIp: "ENABLED",
            securityGroups: ecs.securityGroups,
          },
        },
        overrides: {
          containerOverrides: [container],
        },
      }),
      tap((input) => {
        assert(input);
      }),
      (input) => new RunTaskCommand(input),
      (command) =>
        new ECSClient({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWSAccessKeyId,
            secretAccessKey: process.env.AWSSecretKey,
          },
        }).send(command),
      tap((params) => {
        assert(params);
      }),
      switchCase([
        pipe([get("failures"), first]),
        pipe([
          (failures) => {
            const error = new Error(
              `Error running ecs task: ${inspect(failures)}`
            );
            error.failures;
            throw error;
          },
        ]),
        pipe([
          get("tasks"),
          first,
          get("taskArn"),
          tap((taskArn) => {
            log.debug(`ecsTaskRun ${taskArn}`);
            assert(taskArn);
          }),
        ]),
      ]),
    ]),
    (error) => {
      throw error;
    }
  )();
