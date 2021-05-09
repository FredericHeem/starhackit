const assert = require("assert");
const { DiagramApi } = require("./diagramApi");

const { InfraApi } = require("./infraApi");

module.exports = (app) => {
  app.data.registerModel(__dirname, `models/JobModel`);
  app.data.registerModel(__dirname, `models/InfraModel`);

  DiagramApi(app);
  InfraApi(app);

  return {};
};
