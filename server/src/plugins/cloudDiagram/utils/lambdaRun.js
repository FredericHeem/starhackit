const assert = require("assert");
const { pipe, tap, get, eq, tryCatch, switchCase } = require("rubico");
const { InvokeCommand } = require("@aws-sdk/client-lambda");
const { createLambdaClient } = require("./LambdaClient");
const { AWSAccessKeyId, AWSSecretKey, AWS_REGION } = process.env;

const log = require("logfilename")(__filename);

exports.lambdaRun = ({ ecs }) =>
  tryCatch(
    pipe([
      tap((params) => {
        assert(ecs.subnets);
        assert(ecs.securityGroups);
        log.debug(
          `lambdaRun subnets: ${ecs.subnets}, securityGroups: ${ecs.securityGroups}, AWS_REGION: ${AWS_REGION}`
        );
        assert(AWSAccessKeyId);
        assert(AWSSecretKey);
        assert(AWS_REGION);
      }),
      get("env_vars"),
      tap((params) => {
        assert(params);
      }),
      JSON.stringify,
      (Payload) => ({
        FunctionName: "grucloud",
        InvocationType: "Event",
        Payload,
      }),
      tap((input) => {
        log.debug(`RunTaskCommand: ${JSON.stringify(input)}`);
      }),
      (input) => new InvokeCommand(input),
      (command) => createLambdaClient(process.env).send(command),
      tap((params) => {
        assert(params);
      }),
      switchCase([
        pipe([eq(get("StatusCode"), 202)]),
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
        pipe([
          tap((params) => {
            log.error(`lambdaRun `, params);
          }),
        ]),
      ]),
    ]),
    (error) => {
      throw error;
    }
  );
