const assert = require("assert");
//const Postgrator = require("postgrator");
const Path = require("path");
const pg = require("pg");

exports.migrate = async ({ config, pluginPaths = [] }) => {
  // Create a client of your choice
  const Postgrator = (await import("postgrator")).default;
  assert(config.db.url);
  const client = new pg.Client(config.db.url);

  try {
    // Establish a database connection
    await client.connect();
    const migrationPattern =
      Path.resolve(__dirname, "../plugins", `{${pluginPaths.join(",")}}`) +
      "/migrations/**";
    console.log("migrationPattern", migrationPattern);

    const postgrator = new Postgrator({
      migrationPattern,
      driver: "pg",
      //TODO
      database: "dev",
      execQuery: (query) => {
        //console.log("migrations", query);
        return client.query(query);
      },
    });
    const maxVersionAvailable = await postgrator.getMaxVersion();
    console.log("maxVersionAvailable", maxVersionAvailable);

    // "current" database schema version as number, not string
    const version = await postgrator.getDatabaseVersion();
    console.log("DatabaseVersion", version);

    const result = await postgrator.migrate();
    console.log("migrations done");
  } catch (error) {
    // If error happened partially through migrations,
    // error object is decorated with appliedMigrations
    console.log("Error", error);
    console.error(error.appliedMigrations); // array of migration objects
  }

  await client.end();
};
