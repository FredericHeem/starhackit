import React, {PropTypes} from 'react';
import Checkit from 'checkit';
import TextField from 'material-ui/TextField';
import LaddaButton from 'react-ladda';
import mobx from 'mobx';
import {observer} from 'mobx-react';
import alertAjax from 'components/alertAjax';
import rules from 'services/rules';

export default(context) => {
  const {tr} = context;
  const AlertAjax = alertAjax(context);

  LoginForm.propTypes = {
    login: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
  }

  const store = mobx.observable({
    username: "",
    password: "",
    errors: {},
    login: mobx.action(function(actions) {
      this.errors = {};
      let payload = {
        username: this.username,
        password: this.password
      }

      new Checkit({username: rules.username, password: rules.password}).run(payload).then(actions.login).catch(errors => {
        if (errors instanceof Checkit.Error) {
          this.errors = errors.toJSON()
        }
      });
    }),
  })

  function LoginForm(props){
    const {errors} = store;
    return (
      <form className="local-login-form signup-options text-center form" onSubmit={ (e) => e.preventDefault() }>
        <AlertAjax error={this.props.login.error} className='login-error-view'/>
        <div className='form-group username'>
          <TextField id='username' onChange={(e) => {store.username = e.target.value}} hintText={tr.t('Username')} errorText={errors.username && errors.username[0]}/>
        </div>
        <div className='form-group password'>
          <TextField id='password' onChange={(e) => {store.password = e.target.value}} hintText={tr.t('Password')} type='password' errorText={errors.password && errors.password[0]}/>
        </div>
        <div>
          <LaddaButton className='btn btn-lg btn-primary btn-login' buttonColor='green' loading={props.login.loading} buttonStyle="slide-up" onClick={() => store.login(props.actions)}>{tr.t('Login')}</LaddaButton>
        </div>
      </form>
    );
  }
  return observer(LoginForm);
}
