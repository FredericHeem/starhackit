const { createApiByUser, createRestApiByUser } = require("./apiFactory");

exports.GitCredentialRestApi = (app) => {
  const { models } = app.data.sequelize;
  const api = createApiByUser({ model: models.GitCredential });
  return createRestApiByUser({ pathname: "git_credential", api, app });
};
