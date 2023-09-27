const fs = require("fs-extra");
const asyncBusboy = require("async-busboy");

function Document(app) {
  const { models } = app.plugins.get().document;

  const readContent = async (file) =>
    new Promise((resolve, reject) => {
      fs.readFile(file.path, "binary", function (err, data) {
        fs.unlink(file.path);
        if (err) throw reject(err);
        const data64 = new Buffer(data, "binary").toString("base64");
        resolve(data64);
      });
    });

  const api = {
    pathname: "/document",
    middlewares: [app.server.auth.isAuthenticated],
    ops: [
      {
        pathname: "/",
        method: "get",
        handler: async (context) => {
          const documents = await models.Document.findAll({
            where: { user_id: context.state.user.user_id },
          });
          context.body = documents.map((document) => document.get());
          context.status = 200;
        },
      },
      {
        pathname: "/:type",
        method: "get",
        handler: async (context) => {
          const document = await models.Document.findOne({
            where: {
              user_id: context.state.user.user_id,
              type: context.params.type,
            },
          });
          context.body = document ? document.get() : {};
          context.status = 200;
        },
      },
      {
        pathname: "/:type",
        method: "post",
        handler: async (context) => {
          const config = { limits: { fileSize: 1000000 } };
          const { files, fields } = await asyncBusboy(context.req, config);
          const file = files[0];
          if (!file) {
            context.status = 400;
          } else {
            const content = await readContent(file);
            await models.Document.upsert({
              size: files.length,
              content,
              name: fields.name,
              file_type: fields.file_type,
              type: context.params.type,
              user_id: context.state.user.user_id,
            });

            context.status = 200;
          }
        },
      },
      {
        pathname: "/",
        method: "post",
        handler: async (context) => {
          const config = { limits: { fileSize: 1000000 } };
          const { files, fields } = await asyncBusboy(context.req, config);
          const file = files[0];
          if (!file) {
            context.status = 400;
          } else {
            const content = await readContent(file);
            await models.Document.create({
              size: files.length,
              content,
              name: fields.name,
              file_type: fields.file_type,
              type: fields.type,
              user_id: context.state.user.user_id,
            });
            context.status = 200;
          }
        },
      },
    ],
  };

  app.server.createRouter(api);
  return {};
}

module.exports = Document;
