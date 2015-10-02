import util from 'util';
import BaseJob from "../../../jobs/BaseJob";

let log = require('logfilename')(__filename);

const subscriberOptions = {
  exchange:'user',
  queueName: 'new'
};

export default class MailJob extends BaseJob {
  constructor(app){
    log.info("MailJob subscriberOptions: ", subscriberOptions);
    super(app, subscriberOptions);
    super.getEventEmitter().on('message', this._onIncomingMessage);
  }

  sendEmail(user){
    log.debug("sendEmail to user ", user);
    return Promise.resolve();
  }

  _onIncomingMessage(message) {
    var user = JSON.parse(message.content.toString());
    log.error("onIncomingMessage user: ", user);
    return this.sendEmail(user)
    .then(function(res) {
      log.info("mail sent: ", res);
      super.getSubscriber.ack(message);
      super.getEventEmitter().emit("success", res);
    })
    .catch(function(error) {
      log.error(util.inspect(error));
      super.getSubscriber().nack(message);
      super.getEventEmitter().emit('error', error);
    });
  }
}
