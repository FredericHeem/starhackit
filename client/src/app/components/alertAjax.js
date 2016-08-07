import _ from 'lodash';
import React from 'react';
import Debug from 'debug';
import Alert from './alert';

let debug = new Debug("components:alertAjax");

AlertAjax.propTypes = {
  className: React.PropTypes.string,
  error: React.PropTypes.object
};

export default function AlertAjax({error, className}){
    if(!error){
        return null;
    }
    debug('error:', error);
    const status = _.get(error, 'response.status');
    const message = _.get(error, 'response.data.error.message');
    if(!message || status !== 422){
        return null;
    }
    return (
        <Alert
            type="danger"
            className={className}
            message={message}/>
    )
}
