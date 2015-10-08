//import util from 'util';
import {Subscriber} from 'rabbitmq-pubsub';
import nodemailer from 'nodemailer';
import config from 'config';
let log = require('logfilename')(__filename);

const subscriberOptions = {
  exchange: 'user',
  queueName: 'user.new'
};

export default class MailJob {
  constructor(){
    log.info("MailJob subscriberOptions: ", subscriberOptions);
    this.subscriber = new Subscriber(subscriberOptions);
    if(config.mail.options){
      this.transporter = nodemailer.createTransport(config.mail.options);
    } else {
      log.warn("no mail configuration");
    }
  }

  async start(){
    await this.subscriber.start(this._onIncomingMessage.bind(this));
  }

  async stop(){
    await this.subscriber.stop();
  }

  async _sendEmail(type, user){
    log.debug("sendEmail %s to user ", type, user);
  }

  async _onIncomingMessage(message) {
    log.info("onIncomingMessage content: ", message.content.toString());
    log.info("onIncomingMessage : ", JSON.stringify(message.fields));
    let user;

    try {
      user = JSON.parse(message.content.toString());
    }
    catch(error){
      log.error("cannot convert message");
      this.subscriber.ack(message);
      return;
    }

    try {
      await this._sendEmail('register', user);
      log.info("email mail sent: ");
      this.subscriber.ack(message);
    }
    catch(error){
      log.error("error sending mail: ", error);
      // TODO nack or ack ?
      this.subscriber.ack(message);
      return;
    }
  }
}
