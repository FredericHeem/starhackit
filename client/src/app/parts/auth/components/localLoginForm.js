import React from 'react';
import Checkit from 'checkit';
import TextField from 'material-ui/TextField';
import LaddaButton from 'react-ladda';
import tr from 'i18next';
import Alert from 'components/alert';
import rules from 'services/rules';

export default React.createClass( {
    propTypes:{
        login: React.PropTypes.object.isRequired,
        actions: React.PropTypes.object.isRequired
    },
    getInitialState() {
        return {
            errors: {}
        };
    },
    renderError(){
        //TODO check error code and message
        if(this.props.login.error){
            return (
                <Alert
                    type="danger"
                    message={tr.t('Username and Password do not match')}
                    />
            )
        }
    },
    render() {
        //debug('render state: ', this.state);
        //debug('render props:', this.props);
        let {errors} = this.state;
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
                                errorText={errors.username && errors.username[0]}
                                />
                        </div>
                        <div className='form-group password'>
                            <TextField
                                id='password'
                                ref="password"
                                hintText={tr.t('Password')}
                                type='password'
                                errorText={errors.password && errors.password[0]}
                                />
                        </div>

                        <div>
                            <LaddaButton
                                className='btn btn-lg btn-primary btn-login'
                                buttonColor='green'
                                loading={this.props.login.loading}
                                progress={.5}
                                buttonStyle="slide-up"
                                onClick={this.login}>{ tr.t('Login') }</LaddaButton>
                        </div>
                    </div>
                </form>
            </div>
        );
    },

    login(evt) {
        evt.preventDefault();

        this.setState( {
            errors: {}
        });

        let {username, password} = this.refs;
        // TODO trim spaces
        let payload = {
            username: username.getValue(),
            password: password.getValue()
        }

        let rulesLogin = new Checkit( {
            username: rules.username,
            password: rules.password
        } );

        //console.log('login')
        rulesLogin.run(payload)
            .then( this.props.actions.login)
            .catch( errors => {
                if (errors instanceof Checkit.Error) {
                    this.setState({errors: errors.toJSON()})
                }
            } );
    }
} );
