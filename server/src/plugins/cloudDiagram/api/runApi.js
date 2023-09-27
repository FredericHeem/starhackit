const assert = require("assert");
const {
  switchCase,
  fork,
  tryCatch,
  pipe,
  tap,
  get,
  assign,
} = require("rubico");
const { isEmpty } = require("rubico/x");
const {
  contextSet404,
  contextSetOk,
  contextHandleError,
} = require("utils/koaCommon");

const { middlewareUserBelongsToOrg } = require("../middleware");
const { DockerGcCreate } = require("../utils/rungc");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const buildWhereFromContext = pipe([
  tap((context) => {
    assert(context);
  }),
  fork({
    workspace_id: pipe([get("params.workspace_id")]),
    run_id: pipe([get("params.run_id")]),
  }),
  tap(({ workspace_id, run_id }) => {
    assert(workspace_id);
    assert(run_id);
  }),
]);

const buildLogsUrl = ({ config, context, logfile }) =>
  pipe([
    tap(() => {
      assert(config.aws.bucketUpload);
      assert(logfile);
      assert(context);
    }),
    () => context.params,
    ({ org_id, project_id, workspace_id, run_id }) => ({
      Bucket: config.aws.bucketUpload,
      Key: `${org_id}/${project_id}/${workspace_id}/${run_id}/${logfile}`,
    }),
    tryCatch(
      pipe([
        (input) =>
          getSignedUrl(new S3Client({}), new GetObjectCommand(input), {}),
      ]),
      (error, bucket) =>
        pipe([
          // error happens when using AWS profile
          tap((params) => {
            logger.error(`getSignedUrl error for ${JSON.stringify(bucket)}`);
            logger.error(error);
            logger.error(error.stack);
          }),
          () => ({
            error,
          }),
        ])()
    ),
  ]);
exports.RunApi = ({ app, models }) => {
  const { config } = app;
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
        handler: tryCatch(
          (context) =>
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
                workspace_id: () => context.params.workspace_id,
                status: () => "creating",
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
                      ({ workspace_id }) =>
                        models.workspace.findOne({
                          attributes: ["env_vars"],
                          where: { workspace_id },
                        }),
                      get("env_vars"),
                    ]),
                  }),
                  ({ run_id, env_vars }) => ({
                    run_id,
                    env_vars,
                    provider: "aws",
                    dockerClient: app.dockerClient,
                  }),
                  dockerGcCreate,
                  get("Id"),
                ]),
              }),
              // Save the container_id to the db
              tap((data) => {
                models.run.update({ data, where: { run_id: data.run_id } });
              }),
              contextSetOk({ context }),
              tap((param) => {
                assert(true);
              }),
            ])(),
          contextHandleError
        ),
      },
      {
        pathname: "/",
        method: "get",
        handler: tryCatch(
          (context) =>
            pipe([
              () => ({
                attributes: ["workspace_id", "run_id"],
                where: {
                  workspace_id: context.params.workspace_id,
                },
              }),
              models.run.findAll,
              tap((param) => {
                assert(true);
              }),
              contextSetOk({ context }),
            ])(),
          contextHandleError
        ),
      },
      {
        pathname: "/:run_id",
        method: "get",
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context.params.workspace_id);
                assert(context.params.run_id);
                assert(context.state.user.user_id);
              }),
              () => ({
                attributes: [
                  "workspace_id",
                  "run_id",
                  "container_id",
                  "container_state",
                  "status",
                ],
                where: buildWhereFromContext(context),
              }),
              models.run.findOne,
              switchCase([
                isEmpty,
                tap(contextSet404({ context })),
                tap(
                  pipe([
                    assign({
                      logsUrl: buildLogsUrl({
                        config,
                        context,
                        logfile: "grucloud-debug.log",
                      }),
                    }),
                    contextSetOk({ context }),
                  ])
                ),
              ]),
            ])(),
          contextHandleError
        ),
      },
      {
        pathname: "/:run_id",
        method: "delete",
        handler: tryCatch(
          (context) =>
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
          contextHandleError
        ),
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
