import util from 'util';
import {Subscriber} from 'rabbitmq-pubsub';

let log = require('logfilename')(__filename);

const subscriberOptions = {
  exchange:'user',
  queueName: 'new'
};

export default class MailJob {
  constructor(){
    log.info("MailJob subscriberOptions: ", subscriberOptions);
    this.subscriber = new Subscriber(subscriberOptions);
  }

  start(){
    return this.subscriber.start(this._onIncomingMessage.bind(this));
  }
  stop(){
    return this.subscriber.stop();
  }
  _sendEmail(user){
    log.debug("sendEmail to user ", user);
    return Promise.resolve();
  }

  _onIncomingMessage(message) {
    log.error("onIncomingMessage user: ", message.content.toString());
    let user;

    try {
      user = JSON.parse(message.content.toString());
    }
    catch(error){
      log.error("cannot convert message");
      this.subscriber.ack(message);
      //super.getEventEmitter().emit('error', error);
      return;
    }

    return this._sendEmail(user)
    .then(function(res) {
      log.info("mail sent: ", res);
      this.subscriber.ack(message);
      //super.getEventEmitter().emit("success", res);
    })
    .catch(function(error) {
      log.error(util.inspect(error));
      this.subscriber.nack(message);
      //super.getEventEmitter().emit('error', error);
    });
  }
}
