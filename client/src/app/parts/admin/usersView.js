import React from 'react';
import DocTitle from 'components/docTitle';
import usersComponent from './usersComponent';

export default(context) => {
  const UsersComponent = usersComponent(context);
  return function UserView(props) {
    return (
      <div className="users-view">
        <DocTitle title="Users"/>
        <UsersComponent {...props}/>
      </div>
    );
  }
}
