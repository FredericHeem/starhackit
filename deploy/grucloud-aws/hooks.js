const assert = require("assert");
const ping = require("ping");
const path = require("path");
const Client = require("ssh2").Client;
const { retryCall } = require("@grucloud/core").Retry;

const testPing = ({ host }) =>
  ping.promise.probe(host, {
    timeout: 10,
  });

//const privateKey = require("fs").readFileSync(
//  path.resolve(__dirname, "../../../secrets/kp.pem")
//);

const testSsh = async ({ host, username = "ubuntu" }) =>
  await new Promise((resolve, reject) => {
    const conn = new Client();
    conn
      .on("ready", function () {
        //console.log(`ssh to ${host} ok`);
        conn.end();
        resolve();
      })
      .on("error", function (error) {
        // console.log(`cannot ssh to ${host}`, error);
        reject(error);
      })
      .connect({
        host,
        port: 22,
        username,
        agent: process.env.SSH_AUTH_SOCK,
        //privateKey,
      });
  });

module.exports = ({ resources: { eip, server }, provider }) => {
  assert(provider);
  return {
    onDeployed: {
      init: async () => {
        const eipLive = await eip.getLive();
        const serverLive = await server.getLive();
        assert(serverLive, "server should be alive");
        //Static checks
        assert.equal(serverLive.PublicIpAddress, eipLive.PublicIp);

        const host = eipLive.PublicIp;
        return {
          host,
        };
      },
      actions: [
        //Cannot ping from CircleCI
        /*{
          name: "Ping",
          command: async ({ host }) => {
            const alive = await retryCall({
              name: `ping ${host}`,
              fn: async () => {
                const { alive } = await testPing({ host });
                if (!alive) {
                  throw Error(`cannot ping ${host} yet`);
                }
                return alive;
              },
              shouldRetryOnException: () => true,
              retryCount: 40,
              retryDelay: 5e3,
            });
            assert(alive, `cannot ping ${host}`);
          },
        },*/
        {
          name: "SSH",
          command: async ({ host }) => {
            await retryCall({
              name: `ssh ${host}`,
              fn: async () => {
                await testSsh({ host });
                return true;
              },
              shouldRetryOnException: () => true,
              config: { retryCount: 40, retryDelay: 5e3 },
            });
          },
        },
      ],
    },
    onDestroyed: {
      init: () => {
        //console.log("ec2 onDestroyed");
      },
    },
  };
};
