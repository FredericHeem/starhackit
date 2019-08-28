
const pkg = require("../../../package.json");

export default app => {
  const api = {
    pathname: "/version",
    ops: {
      get: {
        pathname: "/",
        method: "get",
        handler: async context => {
          context.body = {
            version: pkg.version
          };
          context.status = 200;
        }
      },
    }
  };

  app.server.createRouter(api);
  return {};
};
