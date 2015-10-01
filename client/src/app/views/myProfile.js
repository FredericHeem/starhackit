import _ from 'lodash';
import React from 'react/addons';
import Reflux from 'reflux';
import cx from 'classnames';

import formLinkHandlers from 'mixins/formLinkHandlers';
import ValidateProfileForm from 'services/validateProfileForm';

import meStore from 'stores/me';
import authStore from 'stores/auth';

import meActions from 'actions/me';

import UserAvatar from 'components/userAvatar';
import MarkdownEditor from 'components/markdownEditor';

export default React.createClass({

    mixins: [
        Reflux.connect( meStore, 'profile' ),
        React.addons.LinkedStateMixin,
        formLinkHandlers
    ],

    getInitialState() {
        return {
            errors: {}
        };
    },

    componentDidMount() {
        meActions.getMyProfile();
    },

    render() {
        document.title = 'StarterKit - My Profile';

        return (
            <div id="profile">
                <legend>My Profile</legend>

                <div className="jumbotron clearfix">
                    <form className="form-horizontal" onSubmit={ (e) => e.preventDefault() }>
                        <div className="col-sm-11">
                            <div className={this.formClassNames( 'username' )}  >
                                { this.renderUsername() }

                                <legend>My Name</legend>
                                <input type="text"
                                       className="form-control"
                                       valueLink={ this.linkStore( meStore, 'username' ) }
                                    />

                                { this.state.errors.name &&
                                    <span className="label label-danger animate bounceIn">{ this.state.errors.name[ 0 ]}</span>
                                }
                            </div>
                            <br/>

                            <div className={this.formClassNames( 'email' )}  >
                                <legend>My Email</legend>
                                <input type="text"
                                       className="form-control"
                                       valueLink={ this.linkStore( meStore, 'email' ) }
                                    />

                                { this.state.errors.email &&
                                    <span className="label label-danger animate bounceIn">{ this.state.errors.email[ 0 ]}</span>
                                }
                            </div>

                        </div>

                        <div className="col-sm-1">
                            <UserAvatar
                                user={ this.state.profile }
                                />
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group">
                                <legend>About Me</legend>
                                <MarkdownEditor
                                    className="input-description"
                                    useCacheForDOMMeasurements
                                    valueLink={ this.linkStore( meStore, 'about' ) }
                                    rows={ 2 }
                                    />
                            </div>
                        </div>

                        <div className="col-sm-12">
                            <div className="form-group">
                                <div className="btn-toolbar action-buttons">
                                    <button className="btn btn-primary" onClick={ this.updateProfile }>Update Profile</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    },

    renderUsername() {
        let profile = this.state.profile;

        if ( profile.verifications && profile.verifications.length === 1 ) {
            return (
                <div className="username">
                    <legend>My Username</legend>
                    <strong>{ profile.verifications[0].provider_id }</strong>
                </div>
            );
        }
    },

    formClassNames( field ) {
        return cx( 'form-group', {
            'has-error': this.state.errors[ field ]
        } );
    },

    updateProfile() {
        this.setState( {
            errors: {}
        } );

        validateForm.call( this )
            .with( this )
            .then( save )
            .then( successNotification )
            .catch( setErrors );



        function validateForm() {
            return new ValidateProfileForm( {
                name: this.state.profile.name,
                email: this.state.profile.email
            } )
                .execute();
        }

        function save() {
            return meActions.updateMyProfile( {
                name: this.state.profile.name,
                email: this.state.profile.email,
                about: this.state.profile.about
            } );
        }

        function successNotification() {
            $.bootstrapGrowl( 'Profile Updated', { type: 'warning', delay: 5000 } );
        }

        function setErrors( e ) {
            if ( e.name === 'CheckitError' ) {
                this.setState( {
                    errors: e.toJSON()
                } );
            }
        }

    }
} );
