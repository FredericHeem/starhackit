import _ from "lodash";
import Qs from "qs";
import Sequelize from "sequelize";

export default function UserRouter(app) {
  const { models } = app.data.sequelize;

  const api = {
    pathname: "/users",
    middlewares: [
      app.server.auth.isAuthenticated,
      app.server.auth.isAuthorized
    ],
    ops: {
      getAll: {
        pathname: "/",
        method: "get",
        handler: async context => {
          const filter = Qs.parse(context.request.querystring);
          _.defaults(filter, {
            limit: 100,
            order: "DESC",
            offset: 0
          });
          const result = await models.User.findAndCountAll({
            limit: filter.limit,
            order: [["createdAt", filter.order]],
            offset: filter.offset,
            where: filter.search && {
              $or: [
                { username: { $like: `%${filter.search}%` } },
                { email: { $like: `%${filter.search}%` } }
              ]
            }
          });
          context.body = {
            count: result.count,
            data: result.rows.map(user => user.toJSON())
          };
          context.status = 200;
        }
      },
      getOne: {
        pathname: "/:id",
        method: "get",
        handler: async context => {
          const user = await models.User.findByUserId(context.params.id);

          if (!user) {
            context.status = 404;
            context.body = {
              error: {
                code: 404,
                name: "NotFound"
              }
            };
          } else {
            context.body = user.get();
            context.status = 200;
          }
        }
      }
    }
  };

  app.server.createRouter(api);
  return {};
}
