import React from 'react';
import Checkit from 'checkit';
import TextField from 'material-ui/TextField';
import LaddaButton from 'react-ladda';
import alertAjax from 'components/alertAjax';
import rules from 'services/rules';

export default(context) => {
  const {tr} = context;
  const AlertAjax = alertAjax(context);
  return React.createClass({
    propTypes: {
      login: React.PropTypes.object.isRequired,
      actions: React.PropTypes.object.isRequired
    },
    getInitialState() {
      return {errors: {}};
    },
    render() {
      //debug('render state: ', this.state);
      //debug('render props:', this.props);
      let {errors} = this.state;
      return (
        <div className="local-login-form">
          <form>
            <div className="signup-options text-center form">
              <AlertAjax error={this.props.login.error} className='login-error-view'/>
              <div className='form-group username'>
                <TextField id='username' ref="username" hintText={tr.t('Username')} errorText={errors.username && errors.username[0]}/>
              </div>
              <div className='form-group password'>
                <TextField id='password' ref="password" hintText={tr.t('Password')} type='password' errorText={errors.password && errors.password[0]}/>
              </div>

              <div>
                <LaddaButton className='btn btn-lg btn-primary btn-login' buttonColor='green' loading={this.props.login.loading} buttonStyle="slide-up" onClick={this.login}>{tr.t('Login')}</LaddaButton>
              </div>
            </div>
          </form>
        </div>
      );
    },

    login(evt) {
      evt.preventDefault();

      this.setState({errors: {}});

      let {username, password} = this.refs;
      // TODO trim spaces
      let payload = {
        username: username.getValue(),
        password: password.getValue()
      }

      let rulesLogin = new Checkit({username: rules.username, password: rules.password});

      //console.log('login')
      rulesLogin.run(payload).then(this.props.actions.login).catch(errors => {
        if (errors instanceof Checkit.Error) {
          this.setState({errors: errors.toJSON()})
        }
      });
    }
  });
}
