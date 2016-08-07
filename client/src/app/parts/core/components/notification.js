import React from 'react';

export default({tr}) => {
  function Notification({name, code, message}) {
    return (
      <div>
        <h3>{name} {code && `(${code})`}</h3>
        <p>{tr.t(message)}</p>
      </div>
    )
  }

  Notification.propTypes = {
    name: React.PropTypes.string,
    message: React.PropTypes.string,
    code: React.PropTypes.number
  };

  return Notification;
}
