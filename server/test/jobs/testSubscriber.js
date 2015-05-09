var assert = require('assert');
var testManager = require('../testManager');
var app = testManager.app;
var models = app.models;

describe('Subscriber', function(){
  "use strict";
  this.timeout(10e3);
  var hasStarted = false;
  require('../mochaCheck')(testManager);
  var publisher;
  
  before(function(done) {
    console.log("publisher.start()");
    publisher = new app.mq.Publisher(app, {exchange:"user.new"});
    publisher.start().then(done, done);
  });
  after(function(done) {
    console.log("publisher.stop()");
    publisher.stop().then(done, done);
  });
  
  it('should start the mq', function(done){
    console.log("should start the mq");
    var options = {
        exchange:'user.new',
        queueName:'user.new'
    };
    
    var subscriber = new app.mq.Subscriber(app, options);
    subscriber.getEventEmitter().on('message', onIncomingMessage);
    
    subscriber.start()
    .then(function(){
      console.log("started");
      hasStarted = true;
      return models.user.findByUsername("bob");
    })
    .then(function(res){
      var user = res.get();
      publisher.publish('', JSON.stringify(user));
    })
    .then(function(){
    })
    .catch(done);
    
    function onIncomingMessage(message){
      console.log("onIncomingMessage ", message.fields);

      assert(message);
      assert(message.content);
      assert(message.content.length > 0);
      subscriber.ack(message);
      console.log("hasStarted ", hasStarted);
      if(hasStarted){
        
        done();
      }
    }
  });
});
