const Promise = require("bluebird");
const path = require("path");
const _ = require("lodash");

const pluginsName = [
  "version",
  "users",
  //"dbSchema",
  //"document",
  //"ticket",
  //"expoPush",
  "cloudDiagram",
];

function Plugins(app) {
  const plugins = pluginsName.reduce((map, pluginName) => {
    map[pluginName] = require(path.join(__dirname, pluginName))(app);
    return map;
  }, {});

  const action = async (ops) =>
    await Promise.each(_.values(plugins), (obj) => obj[ops] && obj[ops](app));

  return {
    get() {
      return plugins;
    },
    async start() {
      await action("start");
    },
    async stop() {
      await action("stop");
    },
  };
}

module.exports = Plugins;
