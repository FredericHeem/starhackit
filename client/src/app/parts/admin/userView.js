import React from 'react';
import userComponent from './userComponent';

export default (context) => {
  const UserComponent = userComponent(context);

  return function UserView(props) {
    console.log("UserView")
    return (
      <div className="user-view">
        <UserComponent {...props} />
      </div>
    );
  }
}
