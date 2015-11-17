import Promise from 'bluebird';
import UserPlugin from './users/UserPlugin';
import _ from 'lodash';
import Log from 'logfilename';
let log = new Log("plugins");

export default class Plugins {
  constructor(app){
    log.info('ctor');
    this.plugins = {
      users: new UserPlugin(app),
      ticket: require('./ticket/TicketPlugin')(app, app.server)
    };
  }

  get(){
    return this.plugins;
  }

  async start(){
    await Promise.each(_.values(this.plugins), obj => obj.start(this.app));
  }

  async stop(){
    await Promise.each(_.values(this.plugins), obj => obj.stop(this.app));
  }
}
