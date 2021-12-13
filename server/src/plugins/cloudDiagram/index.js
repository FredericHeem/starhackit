const assert = require("assert");
const {
  pipe,
  tap,
  tryCatch,
  assign,
  get,
  eq,
  switchCase,
  map,
} = require("rubico");
const {
  isEmpty,
  values,
  callProp,
  defaultsDeep,
  identity,
  forEach,
} = require("rubico/x");
const fs = require("fs").promises;

const { DockerClient } = require("@grucloud/docker-axios");

const { DiagramApi } = require("./api/diagramApi");
const { InfraPushCodeRestApi } = require("./api/infraPushCodeApi");
const { InfraRestApi } = require("./api/infraApi");
const { GitCredentialRestApi } = require("./api/gitCredentialApi");
const { GitRepositoryRestApi } = require("./api/gitRepositoryApi");

const models = [
  "JobModel",
  "InfraModel",
  "GitCredentialModel",
  "GitRepositoryModel",
];

const configDefault = {
  containerImage: "fredericheem/grucloud-cli:v1.23.0",
  localOutputPath: "output",
  localInputPath: "input",
  docker: {
    baseURL: "http://localhost/v1.40",
    socketPath: "/var/run/docker.sock",
    timeout: 15e3,
  },
};

module.exports = (app) => {
  const log = require("logfilename")(__filename);
  forEach((model) => app.data.registerModel(__dirname, `models/${model}`))(
    models
  );

  app.config = assign({
    infra: pipe([get("infra", {}), defaultsDeep(configDefault)]),
  })(app.config);

  const dockerClient = pipe([
    () => app.config,
    get("infra.docker"),
    DockerClient,
  ])();

  app.dockerClient = dockerClient;

  DiagramApi(app);
  InfraPushCodeRestApi(app);
  InfraRestApi(app);
  GitCredentialRestApi(app);
  GitRepositoryRestApi(app);

  return {
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
