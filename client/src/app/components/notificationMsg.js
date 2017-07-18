import _ from 'lodash';
import React from 'react';

import Debug from 'debug';
const debug = new Debug('HttpMsg');

function createHttpError(payload = {}) {
  debug('createHttpError', payload);
  debug('createHttpError request:', payload.request);
  debug('createHttpError response:', payload.response);
  debug('createHttpError code:', payload.code);
  debug('createHttpError config:', payload.config);
  debug('createHttpError message:', payload.message);
  const { response = {} } = payload;
  function name() {
    if (_.isString(response)) {
      return response;
    }
    return response.statusText;
  }
  function message() {
    const data = _.get(response, 'data');
    if (_.isString(data)) {
      return data;
    } else if (data && _.isString(data.message)) {
      return data.message;
    } else if (payload.message) {
      return payload.message;
    }
  }
  const errorOut = {
    name: name(),
    code: response.status,
    message: message(),
  };
  debug('createHttpError out:', errorOut);
  return errorOut;
}

export default ({ tr }) => function NotificationMsg({ error }) {
  const { name, code, message } = createHttpError(error);
  return (
    <div>
      <h3>{tr.t(name)} {code && `(${code})`}</h3>
      <p>{`${message}`}</p>
    </div>
  );
};
