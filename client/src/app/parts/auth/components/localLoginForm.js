import React, {PropTypes} from 'react';
import TextField from 'material-ui/TextField';
import LaddaButton from 'react-ladda';
import {observer} from 'mobx-react';
import alertAjax from 'components/alertAjax';

export default(context) => {
  const {tr} = context;
  const AlertAjax = alertAjax(context);

  LoginForm.propTypes = {
    store: PropTypes.object.isRequired,
    login: PropTypes.object.isRequired,
  }

  function LoginForm({store, login}){
    const {errors} = store;
    return (
      <form className="local-login-form text-center form" onSubmit={ e => e.preventDefault() }>
        <AlertAjax error={login.error} className='login-error-view'/>
        <div className='form-group username'>
          <TextField id='username' onChange={(e) => {store.username = e.target.value}} hintText={tr.t('Username')} errorText={errors.username && errors.username[0]}/>
        </div>
        <div className='form-group password'>
          <TextField id='password' onChange={(e) => {store.password = e.target.value}} hintText={tr.t('Password')} type='password' errorText={errors.password && errors.password[0]}/>
        </div>
        <div>
          <LaddaButton className='btn btn-lg btn-primary btn-login' buttonColor='green' loading={login.loading} buttonStyle="slide-up" onClick={() => store.login()}>{tr.t('Login')}</LaddaButton>
        </div>
      </form>
    );
  }
  return observer(LoginForm);
}
