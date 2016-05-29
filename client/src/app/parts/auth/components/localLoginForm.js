import React from 'react';
import Checkit from 'checkit';
import TextField from 'material-ui/TextField';
import LaddaButton from 'react-ladda';
import tr from 'i18next';
import Alert from 'components/alert';

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
                                hintText={tr.t('password')}
                                type='password'
                                errorText={errors.password && errors.password[0]}
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

    login(evt) {
        evt.preventDefault()
        let {username, password} = this.refs;
        // TODO trim spaces
        let payload = {
            username: username.getValue(),
            password: password.getValue()
        }
        //console.log('login')
        validateLogin.call( this, payload )
            .with( this )
            .then( this.props.actions.login)
            .catch( setErrors );
    }
} );

function validateLogin( payload ) {
    let rules = new Checkit( {
        username: [ 'required', 'alphaDash', 'minLength:3', 'maxLength:64'],
        password: [ 'required', 'alphaDash', 'minLength:6', 'maxLength:64' ]
    } );
    return rules.run( payload );
}

function setErrors( error ) {
    //console.log('setErrors ', error)
    //debug("setErrors", error);
    if ( error instanceof Checkit.Error ) {
        this.setState({errors: error.toJSON()})
    }
}
