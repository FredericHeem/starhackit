const config = require("config");

module.exports = {
  development: {
    url: config.db.url
  },
  production: {
    url: config.db.url
  }
};
