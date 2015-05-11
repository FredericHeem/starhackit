"use strict";
var util = require('util');
//var Promise = require('bluebird');
//var _ = require('lodash');
var BaseJob = require('./baseJob');

util.inherits(Mail, BaseJob);

function Mail(app){
  var me = this;
  //var models = app.models;
  var log = app.log.get(__filename);
  var options = {
      exchange:'user.register',
      queueName: 'user.register'
  };

  BaseJob.call(this, app, options);

  var emitter = me.getEventEmitter();

  emitter.on('message', onIncomingMessage);

  Mail.prototype.send = function(/*mail*/) {
    //TODO
    log.info('send');
  };

  function onIncomingMessage(message) {
    var user = JSON.parse(message.content.toString());
    log.info("onIncomingMessage user:", user);
    var mail;
    return Mail.send(mail)
    .then(function(res) {
      log.info("tx sent: ",res);
      me.getSubscriber().ack(message);
      emitter.emit("success",res);
    })
    .catch(function(error) {
      log.error(util.inspect(error));
      me.getSubscriber().nack(message);
      emitter.emit('error', error);
    });
  }
}

module.exports = Mail;
