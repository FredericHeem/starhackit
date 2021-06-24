const assert = require("assert");
const path = require("path");
const { pipe, tap, tryCatch, switchCase, map } = require("rubico");
const { isEmpty, callProp } = require("rubico/x");
const uuid = require("uuid");
const fs = require("fs");
const pfs = fs.promises;
const os = require("os");
const { contextSet400, contextSet404, contextSetOk } = require("./common");
const { gitPush } = require("./gitUtils");

const infraFindOne = ({ models }) =>
  pipe([
    ({ id }) =>
      models.Infra.findOne({
        include: [
          {
            model: models.Job,
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
          {
            model: models.GitCredential,
            as: "gitCredential",
          },
          {
            model: models.GitRepository,
            as: "gitRepository",
          },
          {
            model: models.User,
            as: "user",
          },
        ],
        where: {
          id,
        },
      }),
  ]);

exports.infraFindOne = infraFindOne;

const infraFindAll = ({ models }) =>
  pipe([
    ({ user_id }) =>
      models.Infra.findAll({
        include: [
          {
            model: models.Job,
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
          {
            model: models.GitCredential,
            as: "gitCredential",
          },
          {
            model: models.GitRepository,
            as: "gitRepository",
          },
          {
            model: models.User,
            as: "user",
          },
        ],
        where: {
          user_id,
        },
      }),
    map(callProp("get")),
    tap((xxx) => {
      assert(true);
    }),
  ]);

const filesInfraProject = [
  "iac.js",
  "config.js",
  "package.json",
  "hook.js",
  "README.md",
];

exports.InfraApi = (app) => {
  const log = require("logfilename")(__filename);

  const { models } = app.data.sequelize;

  const api = {
    pathname: "/infra",
    middlewares: [
      app.server.auth.isAuthenticated /*,app.server.auth.isAuthorized*/,
    ],
    ops: {
      // createTemplate: {
      //   pathname: "/:id/create_template",
      //   method: "post",
      //   handler: (context) =>
      //     tryCatch(
      //       pipe([
      //         tap(() => {
      //           assert(context.params.id);
      //           assert(context.state.user.id);
      //         }),
      //         switchCase([
      //           () => uuid.validate(context.params.id),
      //           // valid id
      //           pipe([
      //             () =>
      //               infraFindOne({ models })({
      //                 id: context.params.id,
      //               }),
      //             tap((xxx) => {
      //               assert(true);
      //             }),
      //             switchCase([
      //               isEmpty,
      //               tap(() => contextSet404({ context })),
      //               pipe([
      //                 callProp("toJSON"),
      //                 tap((xxx) => {
      //                   assert(true);
      //                 }),
      //                 tap(async (infra) =>
      //                   gitPush({
      //                     infra,
      //                     files: filesInfraProject,
      //                     dirSource: path.resolve(
      //                       __dirname,
      //                       `template/${infra.providerType}/empty`
      //                     ),
      //                     dir: await pfs.mkdtemp(
      //                       path.join(os.tmpdir(), "grucloud-template")
      //                     ),
      //                     message: "new infra project",
      //                   })
      //                 ),
      //                 tap((xxx) => {
      //                   assert(true);
      //                 }),
      //                 contextSetOk({ context }),
      //               ]),
      //             ]),
      //           ]),
      //           // invalid uuid
      //           contextSet400({ context, message: "invalid uuid" }),
      //         ]),
      //       ]),
      //       pipe([
      //         (error) => {
      //           throw error;
      //         },
      //       ])
      //     )(),
      // },
      getAll: {
        pathname: "/",
        method: "get",
        handler: (context) =>
          tryCatch(
            pipe([
              () =>
                infraFindAll({ models })({ user_id: context.state.user.id }),
              contextSetOk({ context }),
            ]),
            pipe([
              // TODO use common handler
              (error) => {
                throw error;
              },
            ])
          )(),
      },
      getOne: {
        pathname: "/:id",
        method: "get",
        handler: (context) =>
          tryCatch(
            pipe([
              tap(() => {
                assert(context.params.id);
                assert(context.state.user.id);
              }),
              switchCase([
                () => uuid.validate(context.params.id),
                // valid id
                pipe([
                  () =>
                    infraFindOne({ models })({
                      id: context.params.id,
                    }),
                  tap((xxx) => {
                    assert(true);
                  }),
                  switchCase([
                    isEmpty,
                    tap(() => contextSet404({ context })),
                    pipe([callProp("get"), contextSetOk({ context })]),
                  ]),
                ]),
                // invalid uuid
                contextSet400({ context, message: "invalid uuid" }),
              ]),
            ]),
            pipe([
              (error) => {
                throw error;
              },
            ])
          )(),
      },
      create: {
        pathname: "/",
        method: "post",
        handler: tryCatch(
          (context) =>
            pipe([
              tap(() => {
                assert(context);
                assert(context.request);
                assert(context.request.body);
                assert(context.state.user.id);
              }),
              () => ({
                ...context.request.body,
                user_id: context.state.user.id,
              }),
              tap((param) => {
                log.debug(`create infra : ${JSON.stringify(param, null, 4)}`);
              }),
              (params) => models.Infra.create(params),
              callProp("toJSON"),
              tap((param) => {
                log.debug(
                  `created infra result: ${JSON.stringify(param, null, 4)}`
                );
              }),
              ({ id }) => infraFindOne({ models })({ id }),
              callProp("toJSON"),

              tap((param) => {
                log.debug(
                  `created infraFindOne: ${JSON.stringify(param, null, 4)}`
                );
              }),
              tap(async (infra) =>
                gitPush({
                  infra,
                  files: filesInfraProject,
                  dirSource: path.resolve(
                    __dirname,
                    `template/${infra.providerType}/empty`
                  ),
                  dir: await pfs.mkdtemp(
                    path.join(os.tmpdir(), "grucloud-template")
                  ),
                  message: "new infra project",
                })
              ),
              contextSetOk({ context }),
            ])(),
          pipe([
            tap((error) => {
              log.error(`post error: ${JSON.stringify(error, null, 4)}`);
              throw error;
            }),
          ])
        ),
      },
      delete: {
        pathname: "/:id",
        method: "delete",
        handler: (context) =>
          tryCatch(
            pipe([
              tap(() => {
                assert(context.params.id);
                assert(context.state.user.id);
              }),
              switchCase([
                () => uuid.validate(context.params.id),
                // valid id
                pipe([
                  () =>
                    models.Infra.destroy({
                      where: {
                        id: context.params.id,
                      },
                    }),
                  tap(contextSetOk({ context })),
                ]),
                // invalid uuid
                contextSet400({ context, message: "invalid uuid" }),
              ]),
            ]),
            pipe([
              (error) => {
                throw error;
              },
            ])
          )(),
      },

      update: {
        pathname: "/:id",
        method: "patch",
        handler: (context) =>
          tryCatch(
            pipe([
              tap(() => {
                assert(context.params.id);
                assert(context.state.user.id);
              }),
              switchCase([
                () => uuid.validate(context.params.id),
                // valid id
                pipe([
                  () =>
                    models.Infra.update(context.request.body, {
                      where: {
                        id: context.params.id,
                      },
                    }),
                  () =>
                    infraFindOne({ models })({
                      id: context.params.id,
                    }),
                  callProp("toJSON"),
                  tap((xxx) => {
                    assert(true);
                  }),
                  tap(contextSetOk({ context })),
                ]),
                // invalid uuid
                contextSet400({ context, message: "invalid uuid" }),
              ]),
            ]),
            pipe([
              (error) => {
                throw error;
              },
            ])
          )(),
      },
    },
  };

  app.server.createRouter(api);
  return { api };
};
