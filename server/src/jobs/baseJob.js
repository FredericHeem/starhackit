"use strict";
import EventEmitter from "events";
import {Subscriber} from 'rabbitmq-pubsub';

let log = require('logfilename')(__filename);

export default class BaseJob {
  constructor(app, options){
    this._subscriber = new Subscriber(options);
    this._eventEmitter = new EventEmitter();
  }

  getEventEmitter(){
    return this._eventEmitter;
  }

  getSubscriber() {
    return this._subscriber;
  }

  start() {
    log.info("start");
    return this._subscriber.start();
  }

  stop() {
    log.info("stop");
    return this._subscriber.stop();
  }
}
