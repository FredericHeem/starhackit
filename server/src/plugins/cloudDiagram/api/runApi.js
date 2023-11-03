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
  map,
} = require("rubico");
const { isEmpty, values, defaultsDeep } = require("rubico/x");
const { contextSet404, contextSetOk } = require("utils/koaCommon");

const { middlewareUserBelongsToOrg } = require("../middleware");
const { DockerGcCreate } = require("../utils/rungc");
const { ecsTaskRun } = require("../utils/ecsTaskRun");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const logger = require("logfilename")(__filename);
const { transformEnv } = require("../utils/envUtils");

const runAttributes = [
  "org_id",
  "project_id",
  "workspace_id",
  "run_id",
  "container_id",
  "container_state",
  "reason",
  "status",
  "engine",
  "error",
];

const buildSubject = ({ org_id, project_id, workspace_id, phase = "plan" }) =>
  `organization:${org_id}:project:${project_id}:workspace:${workspace_id}:run_phase:${phase}`;

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
  assert(models.cloudAuthentication);

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
            assign({
              container_id: (data) =>
                pipe([
                  () => ({
                    attributes: ["env_vars", "provider_type"],
                    where: pick(["org_id", "project_id", "workspace_id"])(data),
                  }),
                  models.cloudAuthentication.findOne,
                  tap((param) => {
                    assert(true);
                  }),
                  defaultsDeep(data),
                  switchCase([
                    eq(get("engine"), "docker"),
                    pipe([
                      ({
                        org_id,
                        project_id,
                        workspace_id,
                        run_id,
                        env_vars,
                        provider_type,
                      }) => ({
                        containerImage: "grucloud/grucloud-cli",
                        org_id,
                        project_id,
                        workspace_id,
                        run_id,
                        env_vars,
                        provider: provider_type,
                        dockerClient: app.dockerClient,
                        GRUCLOUD_OAUTH_SUBJECT: buildSubject({
                          org_id,
                          project_id,
                          workspace_id,
                        }),
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
                        provider_type,
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
                            provider_type,
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
                            "--title",
                            "",
                          ],
                          environment: pipe([
                            () => env_vars,
                            transformEnv({
                              GRUCLOUD_OAUTH_SUBJECT: buildSubject({
                                org_id,
                                project_id,
                                workspace_id,
                              }),
                            }),
                            map.entries(([name, value]) => [
                              name,
                              { name, value },
                            ]),
                            values,
                          ])(),
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
                ])(),
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
              attributes: runAttributes,
              where: buildWhereFromContext(context),
            }),
            models.run.findOne,
            contextSetOk({ context }),
          ])(),
      },
    ],
  };
};
