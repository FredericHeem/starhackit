//import util from 'util';
import {Subscriber} from 'rabbitmq-pubsub';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';

let log = require('logfilename')(__filename);

const subscriberOptions = {
  exchange: 'user',
  queueName: 'user.register'
};

//const templates = ['user.register'];

export default class MailJob {
  constructor(config) {
    log.info("MailJob subscriberOptions: ", subscriberOptions);
    this.config = config;
    this.subscriber = new Subscriber(subscriberOptions);
    log.debug("MailJob options: ", config.mail);
    if (config.mail && config.mail.smtp) {
      this.transporter = nodemailer.createTransport(config.mail.smtp);
    } else {
      log.warn("no mail configuration");
    }
  }

  async start() {
    await this.subscriber.start(this._onIncomingMessage.bind(this));
  }

  async stop() {
    await this.subscriber.stop();
  }

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
  }

  async _sendEmail(type, user) {
    log.debug("sendEmail %s to user ", type, user);
    if(!user.email){
      log.error("email not set");
      return;
    }

    let locals = {
      code: user.code,
      websiteUrl: this.config.websiteUrl,
      signature:this.config.mail.signature
    };

    let template = await this.getTemplate(type);
    let html = ejs.render(template, locals);
    let lines = html.split('\n');
    let subject = lines[0];
    let body = lines.slice(1).join('\n');

    let mailOptions = {
      from: this.config.mail.from,
      to: user.email,
      subject: subject,
      html: body
    };

    log.debug("_sendEmail: ", _.omit(mailOptions, 'html'));

    return new Promise( (resolve, reject) => {
      this.transporter.sendMail(mailOptions, function(error, info){
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
  }

  async _onIncomingMessage(message) {
    log.info("onIncomingMessage content: ", message.content.toString());
    log.info("onIncomingMessage fields: ", JSON.stringify(message.fields));
    let user;

    if(!this.transporter){
      log.error("not configured");
      this.subscriber.ack(message);
      return;
    }

    try {
      user = JSON.parse(message.content.toString());
    } catch (error) {
      log.error("cannot convert message");
      this.subscriber.ack(message);
      return;
    }

    try {
      await this._sendEmail(message.fields.routingKey, user);
      log.info("email sent");
      this.subscriber.ack(message);
    } catch (error) {
      log.error("error sending mail: ", error);
      // TODO nack or ack ?
      this.subscriber.ack(message);
      return;
    }
  }
}
