import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import cx from 'classnames';

import Debug from 'debug';

let debug = new Debug("components:loginForm");

export default React.createClass( {

    mixins: [
        LinkedStateMixin
    ],

    getInitialState() {
        return {
            username: null,
            password: null,
            email: null
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
                        <button className="btn btn-lg btn-primary btn-signup" onClick={this.signup}>{ this.props.buttonCaption }</button>
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

        this.props.onButtonClick( {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        } );
    }

} );
