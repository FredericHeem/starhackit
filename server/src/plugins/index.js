import * as Promise from "bluebird";
import * as path from "path";
import * as _ from "lodash";

const pluginsName = [
  "version",
  "users",
  "dbSchema",
  "document",
  "ticket",
  "expoPush"
];

export default function Plugins(app) {
  const plugins = pluginsName.reduce((map, pluginName) => {
    map[pluginName] = require(path.join(__dirname, pluginName)).default(app);
    return map;
  }, {});

  const action = async ops =>
    await Promise.each(_.values(plugins), obj => obj[ops] && obj[ops](app));

  return {
    get() {
      return plugins;
    },
    async start() {
      await action("start");
    },
    async stop() {
      await action("stop");
    }
  };
}
