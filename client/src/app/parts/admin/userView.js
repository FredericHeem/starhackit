import React from 'react';
import DocTitle from 'components/docTitle';
import userComponent from './userComponent';

export default (context) => {
  const UserComponent = userComponent(context);

  return function UserView(props) {
    return (
      <div className="user-view">
        <DocTitle title="User"/>
        <UserComponent {...props}/>
      </div>
    );
  }
}
