import React from 'react';

Notification.propTypes = {
  name: React.PropTypes.string,
  message: React.PropTypes.string,
  code: React.PropTypes.number
};

export default function Notification({name, code, message}){
    return (
        <div>
            <h3>{name} {code && `(${code})`}</h3>
            <p>{message}</p>
        </div>
    )
}
