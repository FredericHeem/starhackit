"use strict";
var util = require('util');
var Promise = require('bluebird');
import {BaseJob} from './baseJob';

let log = require('logfilename')(__filename);
let options = {
    exchange:'user.register',
    queueName: 'user.register'
};

export class AccountSetupJob extends BaseJob {

  constructor() {
      super(options);
      super.getEventEmitter().on('message', this._onIncomingMessage);
  }

  createAccount(/*options*/) {
    //TODO
    log.info('createAccount', options);
    return Promise.resolve();
  }

  _onIncomingMessage(message) {
    var user = JSON.parse(message.content.toString());
    log.info("onIncomingMessage user:", user);
    return this.createAccount(options)
    .then(function(res) {
      log.info("tx sent: ",res);
      super.getSubscriber.ack(message);
      super.getEventEmitter().emit("success",res);
    })
    .catch(function(error) {
      log.error(util.inspect(error));
      super.getSubscriber().nack(message);
      super.getEventEmitter().emit('error', error);
    });
  }
}
