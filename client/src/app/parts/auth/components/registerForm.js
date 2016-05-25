import React from 'react';
import Checkit from 'checkit';
import TextField from 'material-ui/TextField';
import LaddaButton from 'react-ladda';
import tr from 'i18next';
import Debug from 'debug';

let debug = new Debug("components:register");

export default React.createClass( {
    propTypes:{
    },
    getInitialState() {
        return {
            errors: {}
        };
    },
    renderError(){
        let {error} = this.props.register;
        if(error){
            return (
                <div className="alert alert-danger text-center" role="alert">
                    <strong>{error.name}</strong>
                </div>
            )
        }
    },
    render() {
        debug('render state:', this.state);
        debug('render props:', this.props);
        let {errors} = this.state;
        return (
            <div className="local-login-form">
                <form>
                    <div className="signup-options text-center form">
                        {this.renderError()}
                        <div className='form-group username'>
                            <TextField
                                ref="username"
                                hintText={tr.t('username')}
                                errorText={errors.username && errors.username[0]}
                                />
                        </div>
                        <div className='form-group email'>
                            <TextField
                                ref="email"
                                hintText={tr.t('email')}
                                errorText={errors.email && errors.email[0]}
                                />
                        </div>
                        <div className='form-group password'>
                            <TextField
                                id='password'
                                ref="password"
                                hintText={tr.t('password')}
                                errorText={errors.password && errors.password[0]}
                                type='password'
                                />
                        </div>

                        <div className='btn-signup'>
                            <LaddaButton
                                className='btn btn-lg btn-primary'
                                id='btn-login'
                                buttonColor='green'
                                loading={this.props.loading}
                                progress={.5}
                                buttonStyle="slide-up"
                                onClick={this.register}>{ tr.t('createAccount') }</LaddaButton>
                        </div>
                    </div>
                </form>
            </div>
        );
    },

    register(evt) {
        evt.preventDefault()
        let {username, email, password} = this.refs;
        let payload = {
            username: username.getValue(),
            email: email.getValue(),
            password: password.getValue()
        }

        return validateSignup.call( this, payload )
            .with( this )
            .then( this.props.actions.register)
            .catch( setErrors );

    }
} );

function validateSignup( payload ) {
    let rules = new Checkit( {
        username: [ 'required', 'alphaDash', 'minLength:3', 'maxLength:64'],
        password: [ 'required', 'alphaDash', 'minLength:6', 'maxLength:64' ],
        email: [ 'required', 'email', 'minLength:6', 'maxLength:64' ]
    } );

    return rules.run( payload );
}

function setErrors( error ) {
    debug("setErrors", error);
    if ( error instanceof Checkit.Error ) {
        this.setState({errors: error.toJSON()})
    };
}
