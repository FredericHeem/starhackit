import React from 'react';
import TextField from 'material-ui/lib/text-field';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import cx from 'classnames';
import LaddaButton from 'react-ladda';
import tr from 'i18next';

export default React.createClass( {
    mixins: [
        LinkedStateMixin
    ],

    getInitialState() {
        return {
            username: null,
            password: null,
            email: null,
            loading:false
        };
    },

    render() {
        let {errors} = this.props;
        return (
            <div className="local-signin-form">
                <form action={ this.signup }>
                    <div className="signup-options text-center form">
                        { !this.props.hideEmail &&
                            <div className={this.formClassNames('email')}>
                                <TextField
                                    id='email'
                                    ref="email"
                                    hintText={tr.t('email')}
                                    errorText={errors.email && errors.email[0]}
                                    />
                            </div>
                        }
                        { !this.props.hideUsername &&
                            <div className={this.formClassNames('username')}>
                                <TextField
                                    ref="username"
                                    hintText='Username'
                                    errorText={errors.username && errors.username[0]}
                                    />
                            </div>
                        }
                        <div className={this.formClassNames('password')}>
                            <TextField
                                id='password'
                                ref="password"
                                hintText={tr.t('password')}
                                type='password'
                                errorText={errors.password && errors.password[0]}
                                />
                        </div>

                        <LaddaButton
                            className='btn btn-lg btn-primary btn-signup'
                            id='btn-login'
                            buttonColor='green'
                            loading={this.state.loading}
                            progress={.5}
                            buttonStyle="slide-up"
                            onClick={this.signup}>{ this.props.buttonCaption }</LaddaButton>
                    </div>
                </form>
            </div>
        );
    },

    formClassNames( field ) {
        return cx( 'form-group', {
            'has-error': this.props.errors[ field ],
            'has-success': this.state[ field ] && !(this.props.errors[ field ])
        } );
    },

    signup( e ) {
        e.preventDefault();

        this.setState( {
            loading: true,
        } );
        let {email, username, password} = this.refs;
        this.props.onButtonClick( {
            username: username ? username.getValue() : undefined,
            password: password.getValue(),
            email: email ? email.getValue() : undefined
        } )
        .finally(() => {
            this.setState( {
                loading: false
            } );
        });
    }

} );
