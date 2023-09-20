const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");
const { defaultsDeep, forEach } = require("rubico/x");
const fs = require("fs").promises;

const { DockerClient } = require("@grucloud/docker-axios");

const { DiagramApi } = require("./api/diagramApi");
const { InfraPushCodeRestApi } = require("./api/infraPushCodeApi");
const { InfraRestApi } = require("./api/infraApi");
const { GitCredentialApi } = require("./api/gitCredentialApi");
const { GitRepositoryRestApi } = require("./api/gitRepositoryApi");
const { OrgApi } = require("./api/orgApi");

const configDefault = {
  containerImage: "fredericheem/grucloud-cli:v12.6.2",
  localOutputPath: "output",
  localInputPath: "input",
  docker: {
    baseURL: "http://localhost/v1.41",
    socketPath: "/var/run/docker.sock",
    timeout: 3000e3,
  },
};

module.exports = (app) => {
  const sqlAdaptor = require("utils/SqlAdapter")(app.data.sqlClient);

  const models = {
    org: sqlAdaptor(require("./sql/OrganisationSql")()),
    userOrg: sqlAdaptor(require("./sql/UserOrgSql")()),
    gitCredential: sqlAdaptor(require("./sql/GitCredentialSql")()),
  };

  app.config = assign({
    infra: pipe([get("infra", {}), defaultsDeep(configDefault)]),
  })(app.config);

  const dockerClient = pipe([
    () => app.config,
    get("infra.docker"),
    DockerClient,
  ])();

  app.dockerClient = dockerClient;

  [OrgApi, GitCredentialApi].forEach((router) =>
    app.server.createRouter(router({ app, models }))
  );

  DiagramApi(app);
  InfraPushCodeRestApi(app);
  InfraRestApi(app);
  GitRepositoryRestApi(app);

  return {
    models,
    start: pipe([
      () => ({ image: app.config.infra.containerImage }),
      tap(({ image }) => {
        assert(image);
      }),
      dockerClient.image.pull,
      () => fs.mkdir(app.config.infra.localInputPath, { recursive: true }),
    ]),
    stop: async () => {},
  };
};
