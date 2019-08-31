const redis = require("redis");

function Store(config = {}) {
  let log = require("logfilename")(__filename);
  let client;

  return {
    client() {
      return client;
    },
    async start() {
      log.debug("start ", config);
      return new Promise(function(resolve, reject) {
        if (config.redis) {
          client = redis.createClient(config.redis);
          client.on("error", err => {
            log.error("Error " + err);
            reject(err);
          });
          client.on("ready", () => {
            log.info("ready ");
            resolve();
          });
          client.on("connect", () => {
            log.info("connect ");
          });
          client.on("reconnecting", () => {
            log.info("reconnecting ");
          });
          client.on("end", () => {
            log.info("ready ");
          });
        } else {
          log.error("redis not configured");
          return resolve();
        }
      });
    },
    async stop() {
      log.debug("stop");
      if (client) {
        client.quit();
        client = undefined;
      }
    },
    async subscribe(channel, fn) {
      if (client) {
        client.subscribe(channel);
        client.on("message", fn);
      } else {
        log.warn("subscribe: not configured");
      }
    },
    async unsubscribe() {
      if (client) {
        client.unsubscribe();
      }
    },
    async publish(channel, message) {
      if (client) {
        log.debug(`publish: ${channel} ${message}`);
        client.publish(channel, message);
      } else {
        log.warn("publish: not configured");
      }
    }
  };
}

module.exports = Store;