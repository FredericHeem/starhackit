import React from 'react';

import TextField from 'material-ui/TextField';
import LaddaButton, { L, SLIDE_UP } from 'react-ladda';
import Spinner from 'components/spinner';
import Paper from 'material-ui/Paper';
import {observer} from 'mobx-react';

import Debug from 'debug';
const debug = new Debug("components:profileForm");

export default ({tr}) => {

  function ProfileForm({store, profileGet, profileUpdate}) {
    debug("render props: ");
    const {errors} = store;
    if (profileGet.loading) {
      return <Spinner />
    }

    return (
      <Paper className='profile-view view'>
        <form
          className="form-horizontal"
          onSubmit={(e) => e.preventDefault()}
        >

          <h3>{tr.t('My Profile') }</h3>
          <div>
            <TextField
              id='username'
              floatingLabelText={tr.t('Username')}
              value={store.username}
              disabled
              onChange={(e) => { store.username = e.target.value }}
              errorText={errors.username && errors.username[0]}
            />
            <TextField
              id='email'
              value={store.email}
              disabled
              floatingLabelText={tr.t('Email')}
            />
          </div>
          <br />

          <div>
            <legend>{tr.t('About Me') }</legend>
            <TextField
              id='biography-input'
              fullWidth
              value={store.profile.biography || ""}
              errorText={errors.biography && errors.biography[0]}
              multiLine
              floatingLabelText={tr.t('Enter Biography')}
              rows={1}
              onChange={(e) => { store.profile.biography = e.target.value }}
            />
          </div>

          <div className='text-center btn-container'>
            <LaddaButton
              className='btn btn-lg btn-primary btn-update-profile'
              loading={profileUpdate.loading}
              data-size={L}
              data-style={SLIDE_UP}
              onClick={() => store.update()}
            >{tr.t('Update Profile') }</LaddaButton>
          </div>
        </form>
      </Paper>
    );
  }
  return observer(ProfileForm);
}
