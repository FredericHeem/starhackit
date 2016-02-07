import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import cx from 'classnames';
import LaddaButton from 'react-ladda';

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
        return (
            <div className="local-signin-form">
                <form action={ this.signup }>
                    <div className="signup-options text-center form">
                        { !this.props.hideEmail &&
                            <div className={this.formClassNames('email')}>
                                <input type="text"
                                       className="form-control"
                                       placeholder="Email"
                                       valueLink={this.linkState( 'email' )}
                                    />

                                { this.props.errors.email &&
                                    <span className="label label-danger animate bounceIn">{ this.props.errors.email[ 0 ]}</span>
                                }
                            </div>
                        }
                        { !this.props.hideUsername &&
                            <div className={this.formClassNames('username')}>
                                <input type="text"
                                       className="form-control"
                                       placeholder="Your Username"
                                       valueLink={this.linkState( 'username' )}
                                    />
                                { this.props.errors.username &&
                                    <span className="label label-danger animate bounceIn">{ this.props.errors.username[ 0 ]}</span>
                                }
                            </div>
                        }
                        <div className={this.formClassNames('password')}>
                            <input type='password'
                                   className="form-control"
                                   placeholder="Your Password"
                                   valueLink={this.linkState( 'password' )}
                                />
                            { this.props.errors.password &&
                                <span className="label label-danger animate bounceIn">{ this.props.errors.password[ 0 ]}</span>
                            }
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

        this.props.onButtonClick( {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        } )
        .finally(() => {
            this.setState( {
                loading: false
            } );
        });
    }

} );
