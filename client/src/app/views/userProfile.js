import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import { History } from 'react-router';

import userActions from 'actions/user';

import userProfileStore from 'stores/userProfile';

import authStore from 'stores/auth';

import UserAvatar from 'components/userAvatar';
import MarkedDisplay from 'components/markedDisplay';
import Spinner from 'components/spinner';

export default React.createClass( {

    statics: {
        willTransitionTo: function ( transition, params ) {
            userActions.getProfile( params.id );
        }
    },

    mixins: [
        History,
        Reflux.connect( userProfileStore, 'user' )
    ],

    getInitialState() {
        return {
            display: {
                addFriend: true
            }
        };
    },

    render() {
        return (
            <div id="user-profile">
                { this.renderLoading() }
                { this.renderUserProfile() }
            </div>
        );
    },

    renderUserProfile() {
        let user = this.state.user;

        if ( this.pageIsForUser() ) {
            return (
                <div className="user-profile">
                    <legend>{ user.name } Public Profile</legend>
                    <div className="profile-avatar">
                        <UserAvatar
                            user={ user }
                            />
                    </div>

                    { user.about &&
                    <div className="compact">
                        <MarkedDisplay
                            content={ user.about }
                            />
                    </div>
                    }

                </div>
            );
        }
    },

    renderLoading() {
        if ( !(this.pageIsForUser()) ) {
            return <Spinner />;
        }
    },

    pageIsForUser() {
        let requested = Number( this.getParams().id );
        let got = Number( _.get( this.state.user, 'id' ) );

        return requested === got;
    },

    isNotMe() {
        return !(authStore.isMyId( _.get( this.state.user, 'id' ) ));
    },

    notifySent() {
        $.bootstrapGrowl( `Friend Request Sent to ${this.state.user.name}`, { type: 'warning', delay: 5000 } );
    },

    showError( e ) {
        if ( e.status === 422 ) {
            $.bootstrapGrowl( `Friend Request has already been sent to ${this.state.user.name}`, { type: 'danger', delay: 5000 } );
        } else {
            $.bootstrapGrowl( 'Unknown error has occurred. Please contact us on our Facebook Page or sub-Reddit; links are in the home page', { type: 'danger', delay: 5000 } );
        }
    }
} );
