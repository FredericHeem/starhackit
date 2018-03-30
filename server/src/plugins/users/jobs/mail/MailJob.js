import ejs from "ejs";
import fs from "fs";
import path from "path";
import _ from "lodash";
import Store from "../../../../store/Store";

export default function MailJob(config, sendMail) {
  let log = require("logfilename")(__filename);

  const subscriber = new Store(config);
  log.debug("MailJob options: ", config.mail);

  const onIncomingMessage = async (channel, message) => {
    log.debug("onIncomingMessage content: ", message);
    let user;

    if (!sendMail) {
      log.error("not configured");
      return;
    }

    try {
      user = JSON.parse(message);
    } catch (error) {
      log.error("cannot convert message");
      return;
    }

    try {
      await this._sendEmail(channel, user);
      log.info("email sent");
    } catch (error) {
      log.error("error sending mail: ", error);
      return;
    }
  };
  return {
    async start() {
      log.info("start");
      try {
        await subscriber.start();
        subscriber.subscribe("mail", onIncomingMessage);
        log.debug("started");
      } catch (error) {
        log.error(`cannot start: ${error}`);
      }
    },

    async stop() {
      log.debug("stop");
      await subscriber.stop();
      log.debug("stopped");
    },

    async getTemplate(type) {
      let filename = path.join(
        path.dirname(__filename),
        "templates",
        type + ".html"
      );
      //log.debug("filename", filename);
      return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf8", (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    },

    async _sendEmail(type, user) {
      log.debug("sendEmail %s to user ", type, user);
      if (!user.email) {
        log.error("email not set");
        throw { name: "email not set" };
      }

      if (!user.code) {
        log.error("token not set");
        throw { name: "token not set" };
      }

      if (!sendMail) {
        log.error("mail config not set");
        throw { name: "mail config not set" };
      }

      let locals = {
        code: user.code,
        websiteUrl: config.websiteUrl,
        signature: config.mail.signature
      };

      let template = await this.getTemplate(type);
      let html = ejs.render(template, locals);
      let lines = html.split("\n");
      let subject = lines[0];
      let body = lines.slice(1).join("\n");

      let mailOptions = {
        from: config.mail.from,
        to: user.email,
        subject: subject,
        html: body
      };

      log.debug("_sendEmail: ", _.omit(mailOptions, "html"));

      return new Promise((resolve, reject) => {
        sendMail(mailOptions, function(error, info) {
          if (error) {
            log.error("cannot send mail: ", error);
            reject(error);
          } else {
            delete info.html;
            log.debug("mail sent: ", info);
            resolve(info);
          }
        });
      });
    }
  };
}
