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

  return Notification;
}
