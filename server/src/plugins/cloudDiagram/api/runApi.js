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
  flatMap,
  omit,
} = require("rubico");
const {
  isEmpty,
  values,
  defaultsDeep,
  append,
  when,
  callProp,
  isIn,
} = require("rubico/x");
const { contextSet404, contextSetOk } = require("utils/koaCommon");

const { middlewareUserBelongsToOrg } = require("../middleware");
const { DockerGcCreate } = require("../utils/rungc");
const { ecsTaskRun } = require("../utils/ecsTaskRun");
const { lambdaRun } = require("../utils/lambdaRun");

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");

const { createS3Client } = require("../utils/S3Client");

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
  "kind",
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
        (input) =>
          getSignedUrl(
            createS3Client(process.env),
            new GetObjectCommand(input),
            {}
          ),
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

const buildCmd = ({
  servicesCmd,
  bucketUpload,
  wsUrl,
  provider_type,
  org_id,
  project_id,
  workspace_id,
  run_id,
  kind,
}) =>
  pipe([
    tap((param) => {
      assert(bucketUpload);
      assert(wsUrl);
      assert(provider_type);
      assert(run_id);
      assert(kind);
    }),
    () => [
      kind,
      "--json",
      "artifacts/grucloud-result.json",
      "--s3-bucket",
      bucketUpload,
      "--s3-key",
      `${org_id}/${project_id}/${workspace_id}/${run_id}`,

      ...servicesCmd,
    ],
    when(() => kind == "list", append(["--graph", "--title", '""'])),
    when(() => isIn(["apply", "destroy"])(kind), append("--force")),

    callProp("join", " "),
  ])();

const buildGcFlow = ({
  repository_url,
  working_directory,
  provider_type,
  bucketUpload,
  wsUrl,
  servicesCmd,
  org_id,
  project_id,
  workspace_id,
  run_id,
  kind,
}) =>
  pipe([
    () => [],
    when(
      () => repository_url,
      pipe([
        append({
          name: "rm",
          run: `rm -rf /tmp/my-repo/`,
          workingDirectory: `/tmp/`,
        }),
        append({
          name: "echo $GIT_REPO",
          run: "echo $GIT_REPO",
        }),
        append({
          name: "echo $GIT_BRANCH",
          run: "echo $GIT_BRANCH",
        }),
        append({
          name: "Clone Repo",
          run: "git clone $GIT_REPO -b $GIT_BRANCH --depth 1 /tmp/my-repo",
        }),
        append({
          name: "ls",
          run: "ls -l",
          workingDirectory: `/tmp/my-repo/${working_directory}`,
        }),
        append({
          name: "npm install",
          run: "npm install --loglevel=error  --no-audit",
          workingDirectory: `/tmp/my-repo/${working_directory}`,
        }),
      ])
    ),
    append({
      name: `gc ${kind}`,
      run: `node_modules/.bin/gc ${buildCmd({
        servicesCmd,
        bucketUpload,
        wsUrl,
        provider_type,
        org_id,
        project_id,
        workspace_id,
        run_id,
        kind,
      })}`,
      workingDirectory: `/tmp/my-repo/${working_directory}`,
    }),
    (steps) => ({ steps }),
    JSON.stringify,
  ])();

const grucloudEcsTask = ({ config }) =>
  pipe([
    ({ env_vars }) => ({
      config,
      container: {
        name: "grucloud-cli",
        command: [],
        environment: pipe([
          () => env_vars,
          omit(["SERVICES"]),
          map.entries(([name, value]) => [name, { name, value }]),
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
            models.run.insert,
            tap((param) => {
              assert(true);
            }),
            assign({
              container_id: (data) =>
                pipe([
                  fork({
                    cloudAuthentication: pipe([
                      () => ({
                        attributes: ["env_vars", "provider_type"],
                        where: pick(["org_id", "project_id", "workspace_id"])(
                          data
                        ),
                      }),
                      models.cloudAuthentication.findOne,
                    ]),
                    project: pipe([
                      () => ({
                        attributes: [
                          "repository_url",
                          "branch",
                          "working_directory",
                          "username",
                          "password",
                        ],
                        where: pick(["org_id", "project_id"])(data),
                      }),
                      models.project.findOne,
                    ]),
                    servicesCmd: pipe([
                      get("cloudAuthentication.env_vars.SERVICES", []),
                      flatMap((service) => ["--include-groups", service]),
                    ]),
                  }),
                  tap((param) => {
                    assert(true);
                  }),
                  defaultsDeep(data),
                  assign({
                    env_vars: ({
                      cloudAuthentication,
                      project,
                      servicesCmd,
                      org_id,
                      project_id,
                      workspace_id,
                      run_id,
                      kind,
                    }) =>
                      pipe([
                        () => cloudAuthentication.env_vars,
                        defaultsDeep({
                          DB_URL: config.db.urlDocker ?? config.db.url,
                          S3_BUCKET: aws.bucketUpload,
                          S3_BUCKET_KEY: `${org_id}/${project_id}/${workspace_id}/${run_id}/steps.txt`,
                          GIT_REPO: project.repository_url,
                          GIT_BRANCH: project.branch,
                          GC_FLOW: buildGcFlow({
                            servicesCmd,
                            repository_url: project.repository_url,
                            working_directory: project.working_directory,
                            provider_type: cloudAuthentication.provider_type,
                            bucketUpload: aws.bucketUpload,
                            wsUrl: infra.wsUrl,
                            org_id,
                            project_id,
                            workspace_id,
                            run_id,
                            kind,
                          }),
                          WS_URL: infra.wsUrl,
                          WS_ROOM: `${org_id}/${project_id}/${workspace_id}/${run_id}`,
                        }),
                        transformEnv({
                          GRUCLOUD_OAUTH_SUBJECT: buildSubject({
                            org_id,
                            project_id,
                            workspace_id,
                          }),
                        }),
                      ])(),
                  }),
                  tap((param) => {
                    assert(true);
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
                        cloudAuthentication,
                        project,
                      }) => ({
                        containerImage: "grucloud/grucloud-cli",
                        org_id,
                        project_id,
                        workspace_id,
                        run_id,
                        env_vars,
                        provider: cloudAuthentication.provider_type,
                        dockerClient: app.dockerClient,
                        GRUCLOUD_OAUTH_SUBJECT: buildSubject({
                          org_id,
                          project_id,
                          workspace_id,
                        }),
                        project,
                      }),
                      dockerGcCreate,
                      get("Id"),
                      tap((Id) => {
                        assert(Id);
                      }),
                    ]),
                    eq(get("engine"), "lambda"),
                    lambdaRun(config),
                    // default is ecs
                    grucloudEcsTask({ config }),
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
                      filename: "diagram-live.svg",
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
