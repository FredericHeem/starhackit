import redis from "redis";
let log = require('logfilename')(__filename);

export default function(config = {}) {
  let client;

  return {
    client(){
      return client;
    },
    async start(){
      log.debug("start ", config.redis);
      return new Promise(function(resolve, reject) {
        if(config.redis){
          client = redis.createClient(config.redis);
          client.on("error", (err) => {
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
    async stop(){
      log.debug("stop");
      if(client){
        client.quit();
        client = undefined;
      }
    }
  };
}
