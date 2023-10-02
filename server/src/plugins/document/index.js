const assert = require("assert");
const { pipe, tap } = require("rubico");
const fs = require("fs").promises;
const asyncBusboy = require("async-busboy");
const { contextSet404, contextSetOk } = require("utils/koaCommon");
const { switchCase, map } = require("rubico");
const { isEmpty } = require("rubico/x");

const documentAttributes = ["document_id"];

function Document(app) {
  const { sql } = app.data;

  const sqlAdaptor = require("utils/SqlAdapter")({ sql });
  const models = {
    document: sqlAdaptor(require("./DocumentSql")({ sql })),
  };
  const readContent = (file) =>
    pipe([
      () => fs.readFile(file.path, "binary"),
      (data) => Buffer.from(data, "binary").toString("base64"),
      tap(() => fs.unlink(file.path)),
    ])();

  const api = {
    pathname: "/document",
    middlewares: [app.server.auth.isAuthenticated],
    ops: [
      {
        pathname: "/",
        method: "post",
        handler: (context) =>
          pipe([
            tap(() => {
              assert(context.request.body);
              assert(context.state.user.user_id);
            }),
            // TODO fileSize in config
            () => ({ limits: { fileSize: 1000000 } }),
            (config) => asyncBusboy(context.req, config),
            ({ files, fields }) =>
              pipe([
                () => files,
                switchCase([
                  isEmpty,
                  () => {
                    context.status = 400;
                  },
                  map(
                    pipe([
                      readContent,
                      (content) => ({
                        content,
                        file_type: fields.file_type,
                        type: fields.type ?? "",
                        user_id: context.state.user.user_id,
                      }),
                      tap((param) => {
                        assert(true);
                      }),
                      models.document.insert,
                    ])
                  ),
                  contextSetOk({ context }),
                ]),
              ])(),
          ])(),
      },
      {
        pathname: "/",
        method: "get",
        handler: (context) =>
          pipe([
            tap((param) => {
              assert(context.state.user.user_id);
            }),
            () => ({
              where: { user_id: context.state.user.user_id },
            }),
            models.document.findAll,
            tap((param) => {
              assert(true);
            }),
            contextSetOk({ context }),
          ])(),
      },
      {
        pathname: "/:document_id",
        method: "get",
        handler: (context) =>
          pipe([
            tap(() => {
              assert(context.params.document_id);
              assert(context.state.user.user_id);
            }),
            () => ({
              attributes: documentAttributes,
              where: { document_id: context.params.document_id },
            }),
            models.document.findOne,
            tap((param) => {
              assert(true);
            }),
            switchCase([
              isEmpty,
              contextSet404({ context }),
              contextSetOk({ context }),
            ]),
          ])(),
      },
      {
        pathname: "/:document_id",
        method: "delete",
        handler: (context) =>
          pipe([
            tap((param) => {
              assert(context.params.document_id);
            }),
            () => ({
              where: {
                document_id: context.params.document_id,
              },
            }),
            models.document.destroy,
            () => {
              context.status = 204;
            },
          ])(),
      },
    ],
  };
  app.server.createRouter(api);
  return api;
}

module.exports = Document;
