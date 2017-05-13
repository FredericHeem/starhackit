import React from 'react';
import TextField from 'material-ui/TextField';
import Spinner from 'components/spinner';
import Paper from 'components/Paper';

import { observer } from 'mobx-react';

export default context => {
  const { tr } = context;
  const ButtonLoading = require('components/buttonLoading').default(context);

  function ProfileForm({ store, profileGet, profileUpdate }) {
    const { errors } = store;
    if (profileGet.loading) {
      return <Spinner />;
    }

    return (
      <Paper>
        <form onSubmit={e => e.preventDefault()}>
          <h3>{tr.t('My Profile')}</h3>
          <div>
            <TextField
              id="username"
              floatingLabelText={tr.t('Username')}
              value={store.username}
              disabled
            />
            <TextField id="email" value={store.email} disabled floatingLabelText={tr.t('Email')} />
          </div>
          <br />

          <div>
            <legend>{tr.t('About Me')}</legend>
            <TextField
              id="biography-input"
              fullWidth
              value={store.profile.biography || ''}
              errorText={errors.biography && errors.biography[0]}
              multiLine
              floatingLabelText={tr.t('Enter Biography')}
              rows={1}
              onChange={e => {
                store.profile.biography = e.target.value;
              }}
            />
          </div>

          <div className="btn-update-profile">
            <ButtonLoading loading={profileUpdate.loading} onClick={() => store.update()}>
              {tr.t('Update Profile')}
            </ButtonLoading>
          </div>
        </form>
      </Paper>
    );
  }
  return observer(ProfileForm);
};
