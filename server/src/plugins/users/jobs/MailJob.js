//import util from 'util';
import {
  Subscriber
}
from 'rabbitmq-pubsub';
import nodemailer from 'nodemailer';
let log = require('logfilename')(__filename);

const subscriberOptions = {
  exchange: 'user',
  queueName: 'user.register'
};

export default class MailJob {
  constructor(config = {}) {
    log.info("MailJob subscriberOptions: ", subscriberOptions);
    this.config = config;
    this.subscriber = new Subscriber(subscriberOptions);
    log.debug("MailJob options: ", config);
    if (config.smtp) {
      this.transporter = nodemailer.createTransport(config.smtp);
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

  async _sendEmail(type, user) {
    log.debug("sendEmail %s to user ", type, user);
    if(!user.email){
      log.error("email not set");
      return;
    }

    let mailOptions = {
      from: this.config.from,
      to: user.email,
      subject: 'Confirm email address',
      text: 'Hello world',
      html: '<b>Hello world</b>'
    };

    log.debug("sendEmail: ", mailOptions);

    return new Promise( (resolve, reject) => {
      this.transporter.sendMail(mailOptions, function(error, info){
          if(error){
            log.error("cannot send mail: ", error);
            reject(error);
          } else {
            log.info("mail sent: ", info);
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
