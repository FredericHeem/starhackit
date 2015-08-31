"use strict";
var Promise = require('bluebird');
var amqp = require('amqplib');
var _ = require('underscore-node');
var util = require('util');

function Publisher(options, logOptions) {
	var log = require('logfilename')(__filename, logOptions);
	var _channel;
	var _options = options || {};
	_options = _.defaults(options, {
		type: 'direct',
		url: 'amqp://localhost'
	});

	log.info("Publisher options:", util.inspect(_options));

	Publisher.prototype.start = function() {
		log.info("start ", util.inspect(_options));

		return amqp.connect(_options.url)
			.then(function(conn) {
				log.info("connected to mq");
				return conn.createChannel();
			})
			.then(function(ch) {
				log.info("connected to channel");
				_channel = ch;
				return ch.assertExchange(_options.exchange, _options.type, {
					durable: true
				});
			})
			.then(function(res) {
				log.info("connected ", res);
			});
	};

	Publisher.prototype.stop = function() {
		log.info("stop");
		if (_channel) {
			return _channel.close();
		} else {
			return Promise.resolve();
		}
	};

	Publisher.prototype.publish = function(key, message) {
		log.info("publish exchange:%s, key:%s, message %s", _options.exchange, key,
			message);
		_channel.publish(_options.exchange, key, new Buffer(message));
	};
}

module.exports = Publisher;
