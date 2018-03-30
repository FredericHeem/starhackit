import Promise from 'bluebird';
import Log from 'logfilename';

import PassportAuth from './PassportAuth';

import config from 'config';

// Jobs
import MailJob from './jobs/mail/MailJob';

import MeRouter from './me/MeRouter';

import UserRouter from './user/UserRouter';
import UserApi from './user/UserApi';

import AuthenticationRouter from './authentication/AuthenticationRouter';

let log = new Log(__filename);

export default function UserPlugin(app){

  app.data.registerModelsFromDir(__dirname, './models');

  setupAuthentication(app);

  setupRouter(app);

  let models = app.data.models();

  let mailJob = MailJob(config);

  let parts = [mailJob];

  return {
    async start(){
      try {
        for (let part of parts) {
          await part.start(app);
        };
      } catch(error){
        log.error(`cannot start: ${error}`);
      }
    },

    async stop(){
      await Promise.each(parts, obj => obj.stop(app));
    },

    seedDefault(){
      let seedDefaultFns = [
        models.Group.seedDefault,
        models.User.seedDefault,
        models.Permission.seedDefault,
        models.GroupPermission.seedDefault
      ];
      return Promise.each(seedDefaultFns, fn => fn());
    },

    async isSeeded() {
      let count = await models.User.count();
      log.debug("#users ", count);
      return count;
    }
  };
}

function setupRouter(app){
  //Authentication
  AuthenticationRouter(app);

  //Me
  MeRouter(app);

  //Users
  let userApi = UserApi(app);
  UserRouter(app, userApi);
}

function setupAuthentication(app) {
  let auth = new PassportAuth(app);
  app.auth = auth;
  return auth;
}
