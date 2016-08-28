import React from 'react';
import Debug from 'debug';
import './alert.styl';

let debug = new Debug("components:alert");

export default ({tr}) => {
  function Alert({className, type, title, name, message, code}){
    debug('name: ', name)
    return (
        <div className={`alert alert-${type} text-center ${className}`} role="alert">
            {title && (
                <h3>{title}</h3>
            )}
            {name && (
                <div>{tr.t('An error occured')}
                    <div>{name}</div>
                </div>
            )}
            {message && (
                <div>{tr.t(message)}</div>
            )}
            {code && (
                <div>
                    <div>{tr.t('Status Code')}</div>
                    <div>{code}</div>
                </div>
            )}
        </div>
    )
  }
  Alert.propTypes = {
    className: React.PropTypes.string,
    type: React.PropTypes.string,
    title: React.PropTypes.string,
    name: React.PropTypes.string,
    message: React.PropTypes.string,
    code: React.PropTypes.string
  };
  return Alert;
}
