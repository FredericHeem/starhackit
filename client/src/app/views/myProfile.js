import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import Reflux from 'reflux';

import DocTitle from 'components/docTitle';
import formLinkHandlers from 'mixins/formLinkHandlers';
import ValidateProfileForm from 'services/validateProfileForm';
import meStore from 'stores/me';
import meActions from 'actions/me';
import ProfileForm from 'components/profileForm';

import Debug from 'debug';
let debug = new Debug("view:profile");

export default React.createClass({

    mixins: [
        Reflux.connect( meStore, 'profile' ),
        LinkedStateMixin,
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
        debug('render ', this.state);
        return (
            <div id="profile">
                <DocTitle
                    title="My Profile"
                />
                <legend>My Profile</legend>
                <ProfileForm
                    profile={this.state.profile}
                    updateProfile={this.updateProfile}
                    errors={this.state.errors}
                    />
            </div>
        );
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
                username: this.state.profile.username,
            } )
            .execute();
        }

        function save() {
            return meActions.updateMyProfile( {
                username: this.state.profile.username,
                about: this.state.profile.about
            } );
        }

        function successNotification() {

            //TODO setup notification system
            //$.bootstrapGrowl( 'Profile Updated', { type: 'warning', delay: 5000 } );
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
