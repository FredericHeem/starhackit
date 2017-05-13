import {Subscriber} from 'rabbitmq-pubsub';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const subscriberOptions = {
  exchange: 'user',
  queueName: 'mail',
  routingKeys:['user.registering', 'user.resetpassword']
};

export default function MailJob (config){
  let log = require('logfilename')(__filename);

  function createSubscriber(){
    let rabbitmq = config.rabbitmq;
    if(rabbitmq && rabbitmq.url){
      subscriberOptions.url = rabbitmq.url;
    }
    log.debug("createSubscriber: ", subscriberOptions);
    return new Subscriber(subscriberOptions, config.log);
  }

  let subscriber = createSubscriber(config);
  log.debug("MailJob options: ", config.mail);
  let transporter;
  if (config.mail && config.mail.smtp) {
    transporter = nodemailer.createTransport(config.mail.smtp);
  } else {
    log.warn("no mail configuration");
  }

  return {
    async start() {
      log.info('start');
      try {
        await subscriber.start(this._onIncomingMessage.bind(this));
        log.debug('started');
      } catch(error){
        log.error(`cannot start: ${error}, is RabbitMq running ?`);
      }
    },

    async stop() {
      log.debug('stop');
      await subscriber.stop();
      log.debug('stopped');
    },

    async getTemplate(type){
      let filename = path.join(path.dirname(__filename), 'templates', type + '.html');
      //log.debug("filename", filename);
      return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf8", (error, data) => {
          if(error){
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    },

    async _sendEmail(type, user) {
      log.debug("sendEmail %s to user ", type, user);
      if(!user.email){
        log.error("email not set");
        throw {name:"email not set"};
      }

      if(!user.code){
        log.error("token not set");
        throw {name:"token not set"};
      }

      if(!transporter){
        log.error("mail config not set");
        throw {name:"mail config not set"};
      }

      let locals = {
        code: user.code,
        websiteUrl: config.websiteUrl,
        signature: config.mail.signature
      };

      let template = await this.getTemplate(type);
      let html = ejs.render(template, locals);
      let lines = html.split('\n');
      let subject = lines[0];
      let body = lines.slice(1).join('\n');

      let mailOptions = {
        from: config.mail.from,
        to: user.email,
        subject: subject,
        html: body
      };

      log.debug("_sendEmail: ", _.omit(mailOptions, 'html'));

      return new Promise( (resolve, reject) => {
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
              log.error("cannot send mail: ", error);
              reject(error);
            } else {
              delete info.html;
              log.debug("mail sent: ", info);
              resolve(info);
            }
        });
      });
    },

    async _onIncomingMessage(message) {
      log.debug("onIncomingMessage content: ", message.content.toString());
      log.debug("onIncomingMessage fields: ", JSON.stringify(message.fields));
      let user;

      if(!transporter){
        log.error("not configured");
        subscriber.ack(message);
        return;
      }

      try {
        user = JSON.parse(message.content.toString());
      } catch (error) {
        log.error("cannot convert message");
        subscriber.ack(message);
        return;
      }

      try {
        await this._sendEmail(message.fields.routingKey, user);
        log.info("email sent");
        subscriber.ack(message);
      } catch (error) {
        log.error("error sending mail: ", error);
        // TODO nack or ack ?
        subscriber.ack(message);
        return;
      }
    }
  };
}




