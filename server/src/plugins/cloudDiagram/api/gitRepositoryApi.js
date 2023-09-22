const { createApiByUser, createRestApiByUser } = require("../apiFactory");

exports.GitRepositoryRestApi = ({ app, models }) => {
  const api = createApiByUser({ model: models.gitRepository });
  return createRestApiByUser({ pathname: "git_repository", api, app });
};
