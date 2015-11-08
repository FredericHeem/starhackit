import LinkedStateMixin from 'react-addons-linked-state-mixin';
import Reflux from 'reflux';
import cx from 'classnames';
import DocTitle from 'components/docTitle';
import formLinkHandlers from 'mixins/formLinkHandlers';
import ValidateProfileForm from 'services/validateProfileForm';

import meStore from 'stores/me';

import meActions from 'actions/me';

import UserAvatar from 'components/userAvatar';
import MarkdownEditor from 'components/markdownEditor';

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
        return (
            <div id="profile">
                <DocTitle
                    title="My Profile"
                />
                <legend>My Profile</legend>

                <div className="clearfix">
                    <form className="form-horizontal" onSubmit={ (e) => e.preventDefault() }>
                        <div className="col-sm-11">
                            <div className={this.formClassNames( 'username' )}  >

                                <legend>My Username</legend>
                                <input type="text"
                                       className="form-control"
                                       valueLink={ this.linkStore( meStore, 'username' ) }
                                    />

                                { this.state.errors.username &&
                                    <span className="label label-danger animate bounceIn">{ this.state.errors.username[ 0 ]}</span>
                                }
                            </div>
                            <br/>

                            <div className={this.formClassNames( 'email' )}  >
                                <legend>My Email</legend>
                                <input type="text"
                                       disabled="true"
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
