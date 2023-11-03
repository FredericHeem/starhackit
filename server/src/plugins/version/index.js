const pkg = require("../../../package.json");

function Version(app) {
  const api = {
    pathname: "/version",
    ops: [
      {
        pathname: "/",
        method: "get",
        handler: async (context) => {
          context.body = {
            version: pkg.version,
          };
          context.status = 200;
        },
      },
    ],
  };

  app.server.createRouter(api);
  return {};
}

module.exports = Version;
