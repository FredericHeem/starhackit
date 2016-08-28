import Promise from 'bluebird';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';

let log = require('logfilename')('plugins');

const blackList = [
  'fidor',
  //'ticket'
];

export default function Plugins(app){

  let plugins = {};

  function requirePluginDir(pluginPath, name){
    log.debug(`requirePluginDir: ${pluginPath}, name: ${name}`);
    fs.readdirSync(pluginPath)
      .filter( file => file.slice(-9) === 'Plugin.js')
      .forEach(file => {
        plugins[name] = require(path.join(pluginPath, file))(app);
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
    await Promise.each(_.values(plugins), obj => obj[ops](app));
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
