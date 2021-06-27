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
const { InfraRestApi } = require("./api/infraApi");
const { GitCredentialRestApi } = require("./api/gitCredentialApi");
const { GitRepositoryRestApi } = require("./api/gitRepositoryApi");

const models = [
  "JobModel",
  "InfraModel",
  "GitCredentialModel",
  "GitRepositoryModel",
];

const dockerDefault = {
  baseURL: "http://localhost/v1.40",
  socketPath: "/var/run/docker.sock",
  timeout: 15e3,
};

module.exports = (app) => {
  const log = require("logfilename")(__filename);
  forEach((model) => app.data.registerModel(__dirname, `models/${model}`))(
    models
  );

  const dockerClient = pipe([
    () => app.config.infra.docker,
    defaultsDeep(dockerDefault),
    DockerClient,
  ])();

  app.dockerClient = dockerClient;

  DiagramApi(app);
  InfraRestApi(app);
  GitCredentialRestApi(app);
  GitRepositoryRestApi(app);

  return {
    start: async () => {
      const image = app.config.infra.containerImage;
      log.debug(`pull image: ${image}`);
      await dockerClient.image.pull({ image });
      log.debug(`pulled`);
      await fs.mkdir("input", { recursive: true });
    },

    stop: async () => {},
  };
};
