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
  const { sql } = app.data;
  const sqlAdaptor = require("utils/SqlAdapter")({ sql });
  const models = {
    user: sqlAdaptor(require("./sql/UserSql")({ sql })),
    userPending: sqlAdaptor(require("./sql/UserPendingSql")({ sql })),
  };
  setupAuthentication({ app, models });

  setupRouter({ app, models });

  let parts = [];
  if (config.mail && config.mail.smtp) {
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailJob = MailJob(config, transporter.sendEmail);
    parts.push(mailJob);
  }

  return {
    models,
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

function setupRouter({ app, models }) {
  //Authentication
  AuthenticationRouter({ app, models });

  [MeRouter, UserRouter].forEach((router) =>
    app.server.createRouter(router({ app, models }))
  );
}

function setupAuthentication({ app, models }) {
  let auth = new PassportAuth({ app, models });
  app.auth = auth;
  return auth;
}

module.exports = UserPlugin;
