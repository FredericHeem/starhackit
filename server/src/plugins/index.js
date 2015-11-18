import Promise from 'bluebird';
import _ from 'lodash';

export default function Plugins(app){
  let plugins = {
    users: require('./users/UserPlugin')(app),
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
