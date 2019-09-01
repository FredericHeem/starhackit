const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const Store = require("../../../../store/Store");

const channels = ["user.registering", "user.resetpassword"];

function MailJob(config, sendMail) {
  let log = require("logfilename")(__filename);

  log.debug("MailJob options: ", config.mail);

  const getTemplate = async type => {
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
  };

  const sendEmail = async (type, user) => {
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

    let template = await getTemplate(type);
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

    log.debug("sendEmail: ", _.omit(mailOptions, "html"));

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
  };

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
      await sendEmail(channel, user);
      log.info("email sent");
    } catch (error) {
      log.error("error sending mail: ", error);
      return;
    }
  };

  const subscribers = [];
  return {
    async start() {
      log.info("start");
      try {
        for(let channel of channels){
          const subscriber = new Store(config);
          subscribers.push(subscriber);
          await subscriber.start();
          await subscriber.subscribe(channel, onIncomingMessage);
        }
        log.debug("started");
      } catch (error) {
        log.error(`cannot start: ${error}`);
      }
    },

    async stop() {
      log.debug("stop");
      await Promise.all(subscribers.map(subscriber => subscriber.stop()));
      log.debug("stopped");
    }
  };
}

module.exports = MailJob;