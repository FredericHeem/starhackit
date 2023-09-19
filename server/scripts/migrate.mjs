import Postgrator from "postgrator";
import Path from "path";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
import config from "config";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  // Create a client of your choice
  const client = new pg.Client(config.db.url);

  try {
    // Establish a database connection
    await client.connect();
    const migrationPattern = Path.resolve(__dirname, "../migrations") + "/**";
    console.log("migrationPattern", migrationPattern);

    const postgrator = new Postgrator({
      migrationPattern,
      driver: "pg",
      database: "dev",
      schemaTable: "schemaversion",
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
}
main();
