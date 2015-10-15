/*
import  http from 'http';

let Router = function(app, io) {
  let _clients = {};
  let defaultFunctions = [];
  let errorCb;
  let log = require('logfilename')(__filename);
  let debug = log.debug;

  io.on('connection', function(socket) {
    let ua = socket.handshake.headers['user-agent'] || "???" ;
    debug("router connection %s from %s, ua: %s, #clients %s",
            socket.id, socket.handshake.address, ua, Object.keys(_clients).length);
    //debug(JSON.stringify(socket.handshake))
    _clients[socket.id] = socket;
    socket.on('disconnect', function() {
      debug("disconnect %s, #clients %s", socket.id, Object.keys(_clients).length);
      let client = _clients[socket.id];
      //debug("client.user", client.user);
      if (client) {
        delete  _clients[socket.id];
      } else {
        log.error("cannot found client from id", socket.id);
      }

    });
  });

  this.onDefault = function(cb) {
    defaultFunctions.push(cb);
  };

  this.onError = function(cb) {
    errorCb = cb;
  };

  function onEvent(socket, index, functions, eventName, data) {
    //debug("Router.onEvent eventName: %s, index %s/%s", eventName, index, functions.length);

    function next(error) {
      if (error) {
        //debug("Router next error: %s", error)
        if (errorCb) {
          errorCb(error, socket, eventName, data);
        }
      } else {
        index++;
        //debug("Router next index %s", index);
        if (index < functions.length) {
          onEvent(socket, index, functions, eventName, data);
        } else {
          debug("Router done");
        }
      }

    }

    functions[index](socket, eventName, data, next);
  }

  this.on = function(eventName) {
    if (arguments.length < 2) {
      throw new Error('missing handler handler');
    }

    let functions = Object.create(defaultFunctions);

    for (let i = 1; i < arguments.length; i++) {
      functions.push(arguments[i]);
    }

    //debug("Router.on %s has %s cb, #defaults %s", eventName, functions.length, defaultFunctions.length);

    io.on('connection', function(socket) {
      //debug("on connection ", socket.id);
      socket.on(eventName, function(data) {
        //console.log(data);
        onEvent(socket, 0, functions, eventName, data);
      });
    });
  };
};

module.exports = function(app, expressApp) {
  let log = require('logfilename')(__filename);
  //exports.app = app;
  let server = http.createServer(expressApp);
  let io = require('socket.io').listen(server);

  let router = new Router(app, io);

  function onMessage(client, eventName, data, next) {
    log.debug("onMessage ", eventName);
    next();
  }

  function callbackId(data) {
    if (data) {
      let header = data.header;
      if (header) {
        return header.callbackId;
      }
    }
    return undefined;
  }

  function onError(err, client, eventName, data) {
    let message = eventName ? eventName : '';
    log.info("onError: message: %s, callbackId: %s, error: %s",
            message, callbackId(data), JSON.stringify(err));
    client.emit(message, {message: message, callbackId: callbackId(data), error:err});
  }

  router.onDefault(onMessage);
  //router.onDefault(attachUserFromSessionKey);
  //router.onDefault(attachUserFromApiKey);
  router.onError(onError);

  return {
    io: io,
    router: router,
    callbackId:callbackId
  };
};
*/
