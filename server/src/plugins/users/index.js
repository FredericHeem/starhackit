const Promise = require('bluebird');
const nodemailer = require("nodemailer");
const PassportAuth = require('./PassportAuth');
//TODO
const config = require('config');
// Jobs
const MailJob =  require('./jobs/mail/MailJob');
const MeRouter =  require('./me/MeRouter');
const UserRouter =  require('./user/UserRouter');
const AuthenticationRouter = require('./authentication/AuthenticationRouter');

function UserPlugin(app){
  let log = require("logfilename")(__filename);

  app.data.registerModelsFromDir(__dirname, './models');

  setupAuthentication(app);

  setupRouter(app);

  let models = app.data.models();

  let parts = [];
  if (config.mail && config.mail.smtp) {
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailJob = MailJob(config, transporter.sendEmail);
    parts.push(mailJob);
  }

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
  UserRouter(app);
}

function setupAuthentication(app) {
  let auth = new PassportAuth(app);
  app.auth = auth;
  return auth;
}

module.exports = UserPlugin;