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
const { DockerGcCreate, DockerGcRun } = require("../utils/rungc");

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

exports.RunApi = ({ app, models }) => {
  assert(models.run);
  const dockerGcCreate = DockerGcCreate({ app });
  const dockerGcCRun = DockerGcRun({ app, models });

  return {
    pathname: "/org/:org_id/project/:project_id/workspace/:workspace_id/run",
    middlewares: [
      app.server.auth.isAuthenticated, //
      middlewareUserBelongsToOrg(models),
    ],
    ops: {
      create: {
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
              }),
              models.run.insert,
              tap((param) => {
                assert(true);
              }),
              // start a container and return the Id
              assign({
                container_id: pipe([
                  ({ run_id }) => ({
                    run_id,
                    provider_auth: {},
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
                dockerGcCRun(data);
              }),
              contextSetOk({ context }),
              tap((param) => {
                assert(true);
              }),
            ])(),
          contextHandleError
        ),
      },
      getAll: {
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
      getOne: {
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
                attributes: ["workspace_id", "run_id"],
                where: buildWhereFromContext(context),
              }),
              models.run.findOne,
              tap((param) => {
                assert(true);
              }),
              switchCase([
                isEmpty,
                tap(contextSet404({ context })),
                tap(contextSetOk({ context })),
              ]),
            ])(),
          contextHandleError
        ),
      },
      delete: {
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
      patch: {
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
              attributes: ["workspace_id", "run_id", "reason"],
              where: buildWhereFromContext(context),
            }),
            models.run.findOne,
            contextSetOk({ context }),
          ])(),
      },
    },
  };
};
