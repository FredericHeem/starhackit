import Promise from 'bluebird';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const blackList = [
  'fidor',
  'crossbank'
  //'ticket'
];

export default function Plugins(app){
  let log = require('logfilename')('plugins');
  let plugins = {};

  function requirePluginDir(pluginPath, name){
    log.debug(`requirePluginDir: ${pluginPath}, name: ${name}`);
    fs.readdirSync(pluginPath)
      .filter( file => file.slice(-9) === 'Plugin.js')
      .forEach(file => {
        const plugin = require(path.join(pluginPath, file))(app);
        if(plugin){
          plugins[name] =  plugin;
        } else {
          log.warn(`Plugin ${name} disabled`);
        }
      });
  }

  function createPlugin(dirname) {
      fs.readdirSync(__dirname)
        .filter(file => fs.lstatSync(path.join(dirname, file)).isDirectory())
        .filter(file => !_.includes(file, blackList))
        .forEach(file => requirePluginDir(path.join(dirname, file), file));
  }

  createPlugin(__dirname);

  async function action(ops){
    await Promise.each(_.values(plugins), obj => obj[ops] && obj[ops](app));
  }

  return {
    get(){
      return plugins;
    },
    async start(){
      await action('start');
    },
    async stop(){
      await action('stop');
    }
  };
}
