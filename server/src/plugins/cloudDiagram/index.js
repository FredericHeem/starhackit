const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const fs = require("fs").promises;

const { DockerClient } = require("@grucloud/docker-axios");
const { GetAllApi } = require("./api/getAllApi");

const { OrgApi } = require("./api/orgApi");
const { GitCredentialApi } = require("./api/gitCredentialApi");
const { ProjectApi } = require("./api/projectApi");
const { WorkspaceApi } = require("./api/workspaceApi");
const { GitRepositoryApi } = require("./api/gitRepositoryApi");
const { RunApi } = require("./api/runApi");
const { DockerGcRun } = require("./utils/rungc");

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

const streamDockerLogs = async ({ dockerClient, containerId, ws }) => {
  assert(dockerClient);
  assert(containerId);
  assert(ws);

  console.log("streamDockerLogs ", containerId, "message", message.toString());

  // TODO: validate containerId
  ws.on("error", console.error);

  let container = await dockerClient.container.get({ id: containerId });
  if (!container) {
    console.error("streamDockerLogs containerId does not exist");
    ws.send(JSON.stringify({ error: "container does not exist", containerId }));
    ws.close();
    return;
  }
  const logParam = {
    name: containerId,
    options: {
      stdout: true,
      stderr: true,
      follow: true,
    },
  };
  const stream = await dockerClient.container.logs(logParam);

  ws.once("close", () => {
    console.log("ws ", containerId, "close");
    stream.removeAllListeners();
    stream.destroy();
  });

  stream.on("data", (info) => {
    // console.log(info.toString("utf-8"));
    ws.send(info.toString("utf-8"));
  });
  stream.on("end", (info) => {
    console.log("ws ", containerId, "end");
    ws.close();
  });
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

  const roomMap = new Map();
  const producerMap = new Map();

  app.server.koa.ws.use((ctx) => {
    const ws = ctx.websocket;
    dockerGcRun = DockerGcRun({ app, models, ws });
    ws.on("close", () => {
      console.log("ws close");
      const room = producerMap.get();
      if (room) {
        roomMap.delete(room);
      }
      producerMap.delete(ws);
    });
    ws.on("message", async function (message) {
      assert(ctx.request);
      console.log("ws  message", message.toString());
      try {
        const { command, options } = JSON.parse(message.toString());
        switch (command) {
          case "join":
            console.log("join", options.room);
            const roomInfo = roomMap.get(options.room);
            if (roomInfo) {
              console.log("join", options.room, "room already exist");
              roomMap.set(options.room, [...roomInfo, ws]);
            } else {
              console.log("join", options.room, "create room");
              roomMap.set(options.room, [ws]);
            }
            producerMap.set(ws, options.room);
            break;
          case "list":
          case "logs":
            const room = producerMap.set(ws, options.room);
            if (room) {
              const clients = roomMap.get(room);
              if (clients) {
                clients
                  .filter((c) => c != ws)
                  .forEach((client) => {
                    console.log("sending back");
                    client.send(message);
                  });
              }
            }
            return;
          case "DockerLogs":
            streamDockerLogs({
              containerId: options.containerId,
              ws,
              dockerClient,
            });
            break;
          case "Run":
            dockerGcRun(options);
            return;
        }
      } catch (error) {
        console.error(error);
        ws.close();
      }
    });
  });

  app.config = assign({
    infra: pipe([get("infra", {}), defaultsDeep(configDefault)]),
  })(app.config);

  app.dockerClient = dockerClient;

  [
    GetAllApi,
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
      () => ({ image: app.config.infra.containerImage }),
      tap(({ image }) => {
        assert(image);
      }),
      //TODO
      // dockerClient.image.pull,
      // () => fs.mkdir(app.config.infra.localInputPath, { recursive: true }),
    ]),
    stop: pipe([
      tap(() => {
        assert(true);
      }),
    ]),
  };
};
