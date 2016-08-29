import React from 'react';
import {observer} from 'mobx-react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DocTitle from 'components/docTitle';

export default ({tr}) => {

  const CheckEmail = observer(() =>{
    return (
      <div className='forgot-password-check-email-view'>
        <h3>{tr.t('Step 2 - Check Email') }</h3>
        <p>
          <strong>{tr.t('An email has been sent containing your reset link. Click on this link to proceed.') }</strong>
        </p>
        <p>{tr.t('Please also check your spam folder just in case the reset email ended up there.') }</p>
        <p>{tr.t('This page can be safely closed.') }</p>
      </div>
    );
  })

  const SendPasswordResetEmail = observer(({store}) =>{
    const {errors} = store;
    return (
      <div className="forgot-password-form">
        <h3>{tr.t('Forgot Password ?') }</h3>
        <p>
          <strong>{tr.t('Enter the email address used when you registered with username and password. ') }</strong>
        </p>

        <p>{tr.t('You will be sent a reset code to change your password.') }</p>

        <div className="form-inline">
          <TextField id='email-input' onChange={(e) => { store.email = e.target.value } } hintText={tr.t('Email') } errorText={errors.email && errors.email[0]}/>
        </div>

        <div className="btn-forgot-passord">
          <RaisedButton className='btn-forgot-password' onClick={() => store.requestPasswordReset() } label='Reset Password'/>
        </div>
      </div>
    );
  })

  function ForgotView({store}) {
    return (
      <div className="forgot-password-view">
        <DocTitle title="Forgot password"/>
        <Paper className='text-center view'>
          { store.step === 'SendPasswordResetEmail' && <SendPasswordResetEmail store={store}/>}
          { store.step === 'CheckEmail' && <CheckEmail/>}
        </Paper>
      </div>
    );
  }

  return observer(ForgotView)
}
