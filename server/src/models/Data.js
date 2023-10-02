const postgres = require("postgres");

const { migrate } = require("./migrate");
let log = require("logfilename")(__filename);

const pluginPaths = ["users", "cloudDiagram", "document"];

function Data(config) {
  const sql = postgres(config.db.url);

  return {
    sql,
    async start(app) {
      log.info("db start");
      await migrate({ config, pluginPaths });
    },
    async stop() {
      log.info("db stop");
    },
  };
}

module.exports = Data;
