const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");
const { defaultsDeep, forEach } = require("rubico/x");
const fs = require("fs").promises;

const { DockerClient } = require("@grucloud/docker-axios");
const { RunWorker } = require("./worker/runWorker");
const { OrgApi } = require("./api/orgApi");
const { GitCredentialApi } = require("./api/gitCredentialApi");
const { ProjectApi } = require("./api/projectApi");
const { WorkspaceApi } = require("./api/workspaceApi");
const { GitRepositoryApi } = require("./api/gitRepositoryApi");
const { RunApi } = require("./api/runApi");

const configDefault = {
  containerImage: "fredericheem/grucloud-cli:v12.7.1",
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
  const dockerClient = pipe([
    () => app.config,
    get("infra.docker"),
    DockerClient,
  ])();

  const sqlAdaptor = require("utils/SqlAdapter")({ sql });
  const models = {
    org: sqlAdaptor(require("./sql/OrganisationSql")({ sql })),
    project: sqlAdaptor(require("./sql/ProjectSql")({ sql })),
    workspace: sqlAdaptor(require("./sql/WorkspaceSql")({ sql })),
    gitRepository: sqlAdaptor(require("./sql/GitRepositorySql")({ sql })),
    userOrg: sqlAdaptor(require("./sql/UserOrgSql")({ sql })),
    gitCredential: sqlAdaptor(require("./sql/GitCredentialSql")({ sql })),
    run: sqlAdaptor(require("./sql/RunSql")({ sql })),
  };
  const runWorker = RunWorker({
    config: app.config,
    sql,
    dockerClient,
    models,
  });

  app.config = assign({
    infra: pipe([get("infra", {}), defaultsDeep(configDefault)]),
  })(app.config);

  app.dockerClient = dockerClient;

  [
    OrgApi,
    GitCredentialApi,
    ProjectApi,
    WorkspaceApi,
    GitRepositoryApi,
    RunApi,
  ].forEach((api) => app.server.createRouter(api({ app, models })));

  return {
    models,
    start: pipe([
      runWorker.start,
      () => ({ image: app.config.infra.containerImage }),
      tap(({ image }) => {
        assert(image);
      }),
      dockerClient.image.pull,
      () => fs.mkdir(app.config.infra.localInputPath, { recursive: true }),
    ]),
    stop: pipe([runWorker.stop]),
  };
};
