const Promise = require("bluebird");
const nodemailer = require("nodemailer");
const PassportAuth = require("./PassportAuth");
const config = require("config");
// Jobs

const MailJob = require("./jobs/mail/MailJob");
const MeRouter = require("./me/MeRouter");
const UserRouter = require("./user/UserRouter");
const AuthenticationRouter = require("./authentication/AuthenticationRouter");
function UserPlugin(app) {
  let log = require("logfilename")(__filename);
  const sqlAdaptor = require("utils/SqlAdapter")(app.data.sqlClient);

  app.data.registerModelsFromDir(__dirname, "./models");
  app.data.sql = {
    user: sqlAdaptor(require("./sql/UserSql")()),
    userPending: sqlAdaptor(require("./sql/UserPendingSql")()),
  };
  setupAuthentication(app);

  setupRouter(app);

  let parts = [];
  if (config.mail && config.mail.smtp) {
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailJob = MailJob(config, transporter.sendEmail);
    parts.push(mailJob);
  }

  return {
    async start() {
      try {
        for (let part of parts) {
          await part.start(app);
        }
      } catch (error) {
        log.error(`cannot start: ${error}`);
      }
    },

    async stop() {
      await Promise.each(parts, (obj) => obj.stop(app));
    },
  };
}

function setupRouter(app) {
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
