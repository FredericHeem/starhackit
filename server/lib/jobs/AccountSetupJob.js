"use strict";
var util = require('util');
var StellarBase = require('stellar-base');
//var Promise = require('bluebird');
import {BaseJob} from './baseJob';

let log = require('logfilename')(__filename);
let options = {
  exchange:'user.register',
  queueName: 'user.register'
};

export class AccountSetupJob extends BaseJob {

  constructor(models) {
    super(options);
    super.getEventEmitter().on('message', this._onIncomingMessage);
    this._models = models;
  }

  createAccount(account) {
    //TODO
    log.info('createAccount', account);
    return this._models.user.findByUsername(account.username)
    .then(function(user){
       log.info('createAccount user: ', user.get());
       var keyPair = StellarBase.Keypair.random();
       //assert(keyPair.address());
    });
  }

  _onIncomingMessage(message) {
    var user = JSON.parse(message.content.toString());
    log.info("onIncomingMessage user:", user);
    return this.createAccount(options)
    .then(function(res) {
      log.info("tx sent: ", res);
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
