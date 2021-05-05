const assert = require("assert");
const { pipe, tap, tryCatch, map } = require("rubico");
const { DiagramApi } = require("./diagramApi");

const { InfraApi } = require("./infraApi");

module.exports = (app) => {
  app.data.registerModel(__dirname, `JobModel`);
  app.data.registerModel(__dirname, `InfraModel`);

  DiagramApi(app);
  InfraApi(app);

  return {};
};
