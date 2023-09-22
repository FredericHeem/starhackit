const postgres = require("postgres");

function Data(config) {
  let log = require("logfilename")(__filename);
  const sql = postgres(config.db.url);

  return {
    sql,
    async start(app) {
      log.info("db start");
    },
    async stop() {
      log.info("db stop");
    },
  };
}

module.exports = Data;
