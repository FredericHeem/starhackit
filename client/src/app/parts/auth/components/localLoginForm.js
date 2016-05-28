import React from 'react';
import TextField from 'material-ui/TextField';
import LaddaButton from 'react-ladda';
import tr from 'i18next';
import Alert from 'components/alert';

export default React.createClass( {
    propTypes:{
    },
    renderError(){
        if(this.props.login.error){
            return (
                <Alert
                    message={tr.t('Username and Password do not match')}
                    />
            )
        }
    },
    render() {
        //debug('render state: ', this.state);
        //debug('render props:', this.props);
        return (
            <div className="local-login-form">
                <form>
                    <div className="signup-options text-center form">
                        {this.renderError()}
                        <div className='form-group username'>
                            <TextField
                                id='username'
                                ref="username"
                                hintText={tr.t('Username')}
                                />
                        </div>
                        <div className='form-group password'>
                            <TextField
                                id='password'
                                ref="password"
                                hintText={tr.t('password')}
                                type='password'
                                />
                        </div>

                        <div>
                            <LaddaButton
                                className='btn btn-lg btn-primary'
                                id='btn-login'
                                buttonColor='green'
                                loading={this.props.login.loading}
                                progress={.5}
                                buttonStyle="slide-up"
                                onClick={this.login}>{ tr.t('login') }</LaddaButton>
                        </div>
                    </div>
                </form>
            </div>
        );
    },

    login() {
        let {username, password} = this.refs;
        return this.props.actions.login({
            username: username.getValue(),
            password: password.getValue()
        })
    }
} );
