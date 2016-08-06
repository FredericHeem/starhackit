import _ from 'lodash';
import React from 'react';
import Debug from 'debug';
import Alert from './alert';

let debug = new Debug("components:alert");

AlertAjax.propTypes = {
  className: React.PropTypes.string,
  error: React.PropTypes.object
};

export default function AlertAjax({error, className}){
    debug('name: ', name)
    if(!error){
        return null;
    }

    return (
        <Alert
            type="danger"
            className={className}
            message={_.get(error, 'response.data.error.message')}/>
    )
}
