const assert = require("assert");
const { Docker } = require("node-docker-api");

module.exports = function DockerPlugin(app) {
  assert(app);

  const docker = new Docker({
    socketPath: "/var/run/docker.sock",
  });

  app.server.koa.ws.use((ctx) => {
    const ws = ctx.websocket;
    ws.on("message", async function (message) {
      //console.log("ws ", message);
      assert(ctx.request);
      const containerId = ctx.request.url.split("/")[1];

      // TODO: validate containerId
      ws.on("error", console.error);

      let container = docker.container.get(containerId);
      if (!container) {
        return;
      }

      const stream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
      });

      ws.once("close", () => {
        stream.removeAllListeners();
        stream.destroy();
      });

      stream.on("data", (info) => {
        // console.log(info.toString("utf-8"));
        ws.send(info.toString("utf-8"));
      });
      stream.on("end", (info) => {
        ws.close();
      });
    });
  });

  return {
    start: () => {},
  };
};
