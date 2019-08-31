const config = require("config");

const common = {
  url: config.db.url,
  migrationStorageTableName: "sequelize_meta",
  migrationStorageTableSchema: "sequelize_schema"
};

module.exports = {
  development: common,
  production: common
};
