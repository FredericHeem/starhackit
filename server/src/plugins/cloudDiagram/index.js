const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { DockerClient } = require("@grucloud/docker-axios");
const { GetAllApi } = require("./api/getAllApi");

const { OrgApi } = require("./api/orgApi");
const { ProjectApi } = require("./api/projectApi");
const { WorkspaceApi } = require("./api/workspaceApi");
const { CloudAuthenticationApi } = require("./api/cloudAuthenticationApi");
const { RunApi } = require("./api/runApi");
const { DockerGcRun } = require("./utils/rungc");

const configDefault = {
  containerImage: "grucloud/grucloud-cli",
  localOutputPath: "output",
  localInputPath: "input",
  docker: {
    baseURL: "http://localhost/v1.41",
    socketPath: "/var/run/docker.sock",
    timeout: 3000e3,
  },
};

const streamDockerLogs = async ({ dockerClient, container_id, ws }) => {
  assert(dockerClient);
  assert(container_id);
  assert(ws);

  console.log("streamDockerLogs ", container_id, "message", message.toString());

  // TODO: validate container_id
  ws.on("error", console.error);

  let container = await dockerClient.container.get({ id: container_id });
  if (!container) {
    console.error("streamDockerLogs container_id does not exist");
    ws.send(
      JSON.stringify({ error: "container does not exist", container_id })
    );
    ws.close();
    return;
  }
  const logParam = {
    name: container_id,
    options: {
      stdout: true,
      stderr: true,
      follow: true,
    },
  };
  const stream = await dockerClient.container.logs(logParam);

  ws.once("close", () => {
    console.log("ws ", container_id, "close");
    stream.removeAllListeners();
    stream.destroy();
  });

  stream.on("data", (info) => {
    // console.log(info.toString("utf-8"));
    ws.send(info.toString("utf-8"));
  });
  stream.on("end", (info) => {
    console.log("ws ", container_id, "end");
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
    userOrg: sqlAdaptor(require("./sql/UserOrgSql")({ sql })),
    run: sqlAdaptor(require("./sql/RunSql")({ sql })),
    cloudAuthentication: sqlAdaptor(
      require("./sql/CloudAuthenticationSql")({ sql })
    ),
  };

  const roomMap = new Map();
  const producerMap = new Map();

  app.server.koa.ws.use((ctx) => {
    const ws = ctx.websocket;
    dockerGcRun = DockerGcRun({ app, models, ws });
    ws.on("close", (event) => {
      const room = producerMap.get(ws);
      console.log("ws close room", room);
      //console.log(ws);

      if (room) {
        roomMap.delete(room);
      }
      producerMap.delete(ws);
    });
    ws.on("message", async function (message) {
      assert(ctx.request);
      console.log("ws message", message.toString());
      try {
        const {
          command,
          options = {},
          data = {},
        } = JSON.parse(message.toString());
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
          case "end": {
            const { error } = data;
            const room = producerMap.get(ws);
            if (room) {
              const [org_id, project_id, workspace_id, run_id] =
                room.split("/");
              console.log(
                "list",
                org_id,
                project_id,
                workspace_id,
                run_id,
                ", error: ",
                error
              );
              models.run.update({
                where: { org_id, project_id, workspace_id, run_id },
                data: {
                  status: error ? "error" : "completed",
                  updated_at: new Date().toUTCString(),
                },
              });
            } else {
              console.error("no room for list command");
            }
          }
          // fall through
          case "logs":
            const room = producerMap.get(ws);
            if (room) {
              const clients = roomMap.get(room);
              if (clients) {
                console.error("#clients", clients.length);

                clients
                  .filter((c) => c != ws)
                  .forEach((client) => {
                    console.log("sending back");
                    client.send(message.toString());
                  });
              } else {
                console.error("no client for room", room);
              }
            } else {
              console.error("no room for log command");
            }
            break;
          case "DockerLogs":
            if (options.engine == "docker") {
              await streamDockerLogs({
                container_id: options.container_id,
                engine: options.engine,
                ws,
                dockerClient,
              });
            }
            break;
          case "Run":
            if (options.engine == "docker") {
              await dockerGcRun(options);
            }
            return;
        }
      } catch (error) {
        console.error("ws message", error);
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
    ProjectApi,
    WorkspaceApi,
    RunApi,
    CloudAuthenticationApi,
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
