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
} = require("rubico/x");
const fs = require("fs").promises;

const { DockerClient } = require("@grucloud/docker-axios");

const { DiagramApi } = require("./diagramApi");
const { InfraApi } = require("./infraApi");

const dockerDefault = {
  baseURL: "http://localhost/v1.40",
  socketPath: "/var/run/docker.sock",
  timeout: 15e3,
};

module.exports = (app) => {
  const log = require("logfilename")(__filename);

  app.data.registerModel(__dirname, `models/JobModel`);
  app.data.registerModel(__dirname, `models/InfraModel`);

  const dockerClient = pipe([
    () => app.config.infra.docker,
    defaultsDeep(dockerDefault),
    DockerClient,
  ])();

  app.dockerClient = dockerClient;

  DiagramApi(app);
  InfraApi(app);

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
