// const assert = require("assert");
// const path = require("path");
// const { pipe, tap, tryCatch, switchCase, eq, get, or } = require("rubico");
// const uuid = require("uuid");
// const fs = require("fs");
// const pfs = fs.promises;
// const os = require("os");

// const { contextSet400, contextSetOk } = require("utils/koaCommon");
// const { gitPush } = require("../gitUtils");
// const { infraFindOne } = require("./infraApi");

// const InfraPushCodeApi = ({ models, log }) => ({
//   create: ({ id }) =>
//     pipe([
//       () => infraFindOne({ models })({ id }),
//       tap((infra) => {
//         log.debug(`InfraPushCodeApi: ${JSON.stringify({ infra }, null, 4)}`);
//       }),
//       tap(async (infra) =>
//         gitPush({
//           infra,
//           dirTemplate: await path.join(
//             os.tmpdir(),
//             "grucloud-example-template"
//           ),
//           dir: await pfs.mkdtemp(path.join(os.tmpdir(), "grucloud-user-dir")),
//           message: "new infra project",
//         })
//       ),
//     ])(),
// });

// exports.InfraPushCodeRestApi = ({ app, models }) => {
//   const log = require("logfilename")(__filename);
//   const api = InfraPushCodeApi({ model: models.Infra, models, log });
//   const apiSpec = {
//     pathname: "/infra",
//     middlewares: [
//       app.server.auth.isAuthenticated /*,app.server.auth.isAuthorized*/,
//     ],
//     ops: [
//       {
//         pathname: "/:id/push_code",
//         method: "post",
//         handler: (context) =>
//           tryCatch(
//             pipe([
//               tap(() => {
//                 assert(context.params.id);
//                 assert(context.state.user.user_id);
//               }),
//               switchCase([
//                 () => uuid.validate(context.params.id),
//                 // valid id
//                 pipe([
//                   () =>
//                     api.create({
//                       id: context.params.id,
//                       data: context.request.body,
//                     }),
//                   tap(contextSetOk({ context })),
//                 ]),
//                 // invalid uuid
//                 contextSet400({ context, message: "invalid uuid" }),
//               ]),
//             ]),
//             (error) =>
//               pipe([
//                 tap(() => {
//                   console.error(error);
//                 }),
//                 () => {
//                   context.status = 422;
//                   context.body = { ...error, message: error.toString() };
//                 },
//               ])()
//           )(),
//       },
//     ],
//   };

//   app.server.createRouter(apiSpec);
//   return { api: apiSpec };
// };
