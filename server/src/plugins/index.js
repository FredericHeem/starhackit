import UserPlugin from './users/UserPlugin';
import Log from 'logfilename';
let log = new Log("plugins");

export default class Plugins {
  constructor(app){
    log.info('ctor');
    this.users = new UserPlugin(app);
    this.users.registerRouter(app.server);
  }

  start(){
    return this.users.start();
  }
  stop(){
    return this.users.stop();
  }
}
