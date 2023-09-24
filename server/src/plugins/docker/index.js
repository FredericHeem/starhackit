const assert = require("assert");
const { pipe, get } = require("rubico");

module.exports = function DockerPlugin(app) {
  assert(app);

  return {
    start: () => {},
  };
};
