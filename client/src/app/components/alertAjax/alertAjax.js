import _ from 'lodash';
import React from 'react';
import Debug from 'debug';
import alert from '../alert';

let debug = new Debug("components:alertAjax");

// A component to display Axios errors

export default (context) => {
  const Alert = alert(context);

  function AlertAjax({error, className}) {
    if (!error) {
      return null;
    }
    debug('error:', error);
    const status = _.get(error, 'response.status');
    debug('error status :', status);
    if(![401, 422].includes(status)){
      return null;
    }
    let message = _.get(error, 'response.data.error.message');
    if (!message) {
      message = error.message
    }
    return (<Alert type="danger" className={className} message={message}/>)
  }

  AlertAjax.propTypes = {
    className: React.PropTypes.string,
    error: React.PropTypes.object
  };
  return AlertAjax;
}
