import Promise from 'bluebird';
import UserPlugin from './users/UserPlugin';
import _ from 'lodash';
import Log from 'logfilename';
let log = new Log("plugins");

export default function Plugins(app){
  let plugins = {
    users: new UserPlugin(app),
    ticket: require('./ticket/TicketPlugin')(app, app.server)
  };

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
