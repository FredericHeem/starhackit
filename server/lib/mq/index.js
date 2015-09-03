var mq = function() {
  "use strict";
  mq.Subscriber = require('./subscriber');
  mq.Publisher = require('./publisher');

  return mq;
};

module.exports = mq;
