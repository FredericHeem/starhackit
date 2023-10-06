const assert = require("assert");
const {
  switchCase,
  fork,
  tryCatch,
  pipe,
  tap,
  get,
  eq,
  assign,
  pick,
} = require("rubico");
const { isEmpty } = require("rubico/x");
const { contextSet404, contextSetOk } = require("utils/koaCommon");

const { middlewareUserBelongsToOrg } = require("../middleware");
const { DockerGcCreate } = require("../utils/rungc");
const { ecsTaskRun } = require("../utils/ecsTaskRun");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const logger = require("logfilename")(__filename);

const runAttributes = [
  "org_id",
  "project_id",
  "workspace_id",
  "run_id",
  "container_id",
  "container_state",
  "status",
  "engine",
];

const buildWhereFromContext = pipe([
  tap((context) => {
    assert(context);
  }),
  fork({
    org_id: pipe([get("params.org_id")]),
    project_id: pipe([get("params.project_id")]),
    workspace_id: pipe([get("params.workspace_id")]),
    run_id: pipe([get("params.run_id")]),
  }),
  tap(({ org_id, project_id, workspace_id, run_id }) => {
    assert(org_id);
    assert(project_id);
    assert(workspace_id);
    assert(run_id);
  }),
]);

const buildS3SignedUrl = ({ config, context, filename }) =>
  pipe([
    tap(() => {
      assert(config.aws.bucketUpload);
      assert(filename);
      assert(context);
    }),
    () => context.params,
    ({ org_id, project_id, workspace_id, run_id }) => ({
      Bucket: config.aws.bucketUpload,
      Key: `${org_id}/${project_id}/${workspace_id}/${run_id}/${filename}`,
    }),
    tryCatch(
      pipe([
        //TODO credentials
        (input) =>
          getSignedUrl(new S3Client({}), new GetObjectCommand(input), {}),
      ]),
      (error, bucket) =>
        pipe([
          // error happens when using AWS profile
          tap((params) => {
            logger.error(
              `buildS3SignedUrl getSignedUrl error for ${JSON.stringify(
                bucket
              )}`
            );
            logger.error(error);
          }),
          () => ({
            error,
          }),
        ])()
    ),
  ]);
exports.RunApi = ({ app, models }) => {
  const { config } = app;
  const { aws, infra } = config;
  assert(models.run);
  const dockerGcCreate = DockerGcCreate({ app });

  return {
    pathname: "/org/:org_id/project/:project_id/workspace/:workspace_id/run",
    middlewares: [
      app.server.auth.isAuthenticated, //
      middlewareUserBelongsToOrg(models),
    ],
    ops: [
      {
        pathname: "/",
        method: "post",
        handler: (context) =>
          pipe([
            tap(() => {
              assert(context.request.body);
              assert(context.state.user.user_id);
              assert(context.params.org_id);
              assert(context.params.project_id);
              assert(context.params.workspace_id);
            }),
            () => context.request.body,
            assign({
              org_id: () => context.params.org_id,
              project_id: () => context.params.project_id,
              workspace_id: () => context.params.workspace_id,
              status: () => "creating",
            }),
            tap((param) => {
              assert(true);
            }),
            models.run.insert,
            tap((param) => {
              assert(true);
            }),
            // start a container and return the Id
            assign({
              container_id: pipe([
                assign({
                  env_vars: pipe([
                    ({ org_id, project_id, workspace_id }) =>
                      models.workspace.findOne({
                        attributes: ["env_vars"],
                        where: { org_id, project_id, workspace_id },
                      }),
                    get("env_vars"),
                  ]),
                }),
                switchCase([
                  eq(get("engine"), "docker"),
                  pipe([
                    ({
                      org_id,
                      project_id,
                      workspace_id,
                      run_id,
                      env_vars,
                    }) => ({
                      containerImage: "grucloud/grucloud-cli",
                      org_id,
                      project_id,
                      workspace_id,
                      run_id,
                      env_vars,
                      provider: "aws",
                      dockerClient: app.dockerClient,
                    }),
                    dockerGcCreate,
                    get("Id"),
                    tap((Id) => {
                      assert(Id);
                    }),
                  ]),
                  // default is ecs
                  pipe([
                    ({
                      org_id,
                      project_id,
                      workspace_id,
                      run_id,
                      env_vars,
                    }) => ({
                      config,
                      container: {
                        name: "grucloud-cli",
                        command: [
                          "list",
                          "--json",
                          "grucloud-result.json",
                          "--graph",
                          "--infra",
                          `/app/iac.js`,
                          "--provider",
                          "aws",
                          "--s3-bucket",
                          aws.bucketUpload,
                          "--s3-key",
                          `${org_id}/${project_id}/${workspace_id}/${run_id}`,
                          "--s3-local-dir",
                          "/app/artifacts",
                          "--ws-url",
                          infra.wsUrl,
                          "--ws-room",
                          `${org_id}/${project_id}/${workspace_id}/${run_id}`,
                        ],
                        environment: [
                          {
                            name: "AWSAccessKeyId",
                            value: process.env.AWSAccessKeyId,
                          },
                          {
                            name: "AWSSecretKey",
                            value: process.env.AWSSecretKey,
                          },
                          { name: "AWS_REGION", value: process.env.AWS_REGION },
                          { name: "CONTINUOUS_INTEGRATION", value: "1" },
                        ],
                      },
                    }),
                    tap((param) => {
                      assert(true);
                    }),
                    ecsTaskRun,
                    tap((param) => {
                      assert(true);
                    }),
                  ]),
                ]),
              ]),
            }),
            assign({ status: () => "running" }),
            // Save the container_id to the db
            tap((data) => {
              models.run.update({
                data,
                where: pick(["org_id", "project_id", "workspace_id", "run_id"])(
                  data
                ),
              });
            }),
            contextSetOk({ context }),
          ])(),
      },
      {
        pathname: "/",
        method: "get",
        handler: (context) =>
          pipe([
            () => ({
              attributes: runAttributes,
              where: {
                org_id: context.params.org_id,
                project_id: context.params.project_id,
                workspace_id: context.params.workspace_id,
              },
            }),
            models.run.findAll,
            tap((param) => {
              assert(true);
            }),
            contextSetOk({ context }),
          ])(),
      },
      {
        pathname: "/:run_id",
        method: "get",
        handler: (context) =>
          pipe([
            tap(() => {
              assert(context.params.workspace_id);
              assert(context.params.run_id);
              assert(context.state.user.user_id);
            }),
            () => ({
              attributes: runAttributes,
              where: buildWhereFromContext(context),
            }),
            models.run.findOne,
            switchCase([
              isEmpty,
              tap(contextSet404({ context })),
              tap(
                pipe([
                  assign({
                    logsUrl: buildS3SignedUrl({
                      config,
                      context,
                      filename: "grucloud-debug.log",
                    }),
                    stateUrl: buildS3SignedUrl({
                      config,
                      context,
                      filename: "grucloud-result.json",
                    }),
                    svgUrl: buildS3SignedUrl({
                      config,
                      context,
                      filename: "artifacts/diagram-live.svg",
                    }),
                  }),
                  contextSetOk({ context }),
                ])
              ),
            ]),
          ])(),
      },
      {
        pathname: "/:run_id",
        method: "delete",
        handler: (context) =>
          pipe([
            tap(() => {
              assert(context.params.workspace_id);
              assert(context.params.run_id);
              assert(context.state.user.user_id);
            }),
            () => ({
              where: buildWhereFromContext(context),
            }),
            models.run.destroy,
            () => {
              context.status = 204;
            },
          ])(),
      },
      {
        pathname: "/:run_id",
        method: "patch",
        handler: (context) =>
          pipe([
            tap(() => {
              assert(context.params.workspace_id);
              assert(context.params.run_id);
              assert(context.state.user.user_id);
            }),
            () => ({
              data: context.request.body,
              where: buildWhereFromContext(context),
            }),
            models.run.update,
            () => ({
              attributes: [
                "workspace_id",
                "run_id",
                "reason",
                "container_state",
                "status",
              ],
              where: buildWhereFromContext(context),
            }),
            models.run.findOne,
            contextSetOk({ context }),
          ])(),
      },
    ],
  };
};
