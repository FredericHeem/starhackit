import React from 'react';
import TextField from 'material-ui/TextField';
import LaddaButton from 'react-ladda';
import tr from 'i18next';
import Debug from 'debug';
let debug = new Debug("components:login");

export default React.createClass( {
    propTypes:{
    },
    renderError(){
        if(this.props.login.error){
            return (
                <div className="alert alert-danger text-center" role="alert">
                    <strong>Username</strong> and <strong>Password</strong> do not match
                </div>
            )
        }
    },
    render() {
        debug('render state:', this.state);
        debug('render props:', this.props);
        return (
            <div className="local-login-form">
                <form>
                    <div className="signup-options text-center form">
                        {this.renderError()}
                        <div className='form-group username'>
                            <TextField
                                id='username'
                                ref="username"
                                hintText='Username'
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
