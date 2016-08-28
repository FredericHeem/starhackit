import _ from 'lodash';
import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Spinner from 'components/spinner';
import Debug from 'debug';
let debug = new Debug("components:user");

export default({tr}) => {
  UserComponent.propTypes = {
    usersGetOne: PropTypes.object.isRequired
  };

  function UserComponent(props) {
    debug(props);
    let user = props.usersGetOne.data;
    if (_.isEmpty(user)) {
      return <Spinner/>
    }
    return (
      <Paper className='text-center view user-view'>
        <h3>{tr.t('User')}</h3>
        <div>
          <TextField id='id' value={user.id} disabled={true} floatingLabelText={tr.t('Id')}/>
        </div>
        <div className="">
          <TextField id='username' value={user.username} floatingLabelText={tr.t('Username')}/>
        </div>
        <div className="">
          <TextField id='email' value={user.email} floatingLabelText={tr.t('Email')}/>
        </div>
      </Paper>
    );
  }
  return UserComponent;
}
