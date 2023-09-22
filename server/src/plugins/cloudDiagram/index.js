const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");
const { defaultsDeep, forEach } = require("rubico/x");
const fs = require("fs").promises;

const { DockerClient } = require("@grucloud/docker-axios");

// const { DiagramApi } = require("./api/diagramApi");
// const { InfraPushCodeRestApi } = require("./api/infraPushCodeApi");
// const { InfraRestApi } = require("./api/infraApi");
const { GitCredentialApi } = require("./api/gitCredentialApi");
const { ProjectApi } = require("./api/projectApi");
const { WorkspaceApi } = require("./api/workspaceApi");
const { GitRepositoryApi } = require("./api/gitRepositoryApi");
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
  const { sql } = app.data;
  const sqlAdaptor = require("utils/SqlAdapter")({ sql });
  const models = {
    org: sqlAdaptor(require("./sql/OrganisationSql")({ sql })),
    project: sqlAdaptor(require("./sql/ProjectSql")({ sql })),
    workspace: sqlAdaptor(require("./sql/WorkspaceSql")({ sql })),
    gitRepository: sqlAdaptor(require("./sql/GitRepositorySql")({ sql })),
    userOrg: sqlAdaptor(require("./sql/UserOrgSql")({ sql })),
    gitCredential: sqlAdaptor(require("./sql/GitCredentialSql")({ sql })),
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

  [
    OrgApi,
    ProjectApi,
    WorkspaceApi,
    GitCredentialApi,
    //DiagramApi,
    //InfraPushCodeRestApi,
    //InfraRestApi,
    GitRepositoryApi,
  ].forEach((api) => app.server.createRouter(api({ app, models })));

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
