const { createApiByUser, createRestApiByUser } = require("../apiFactory");

exports.GitRepositoryRestApi = (app) => {
  const { models } = app.data.sequelize;
  const api = createApiByUser({ model: models.GitRepository });
  return createRestApiByUser({ pathname: "git_repository", api, app });
};
