import _ from 'lodash';
import React from 'react';
import TextField from 'material-ui/lib/text-field';
import TextArea from 'react-textarea-autosize';
import tr from 'i18next';
import Debug from 'debug';
let debug = new Debug("components:profileForm");

export default React.createClass({
    propTypes: {
        profile: React.PropTypes.object.isRequired,
        errors:React.PropTypes.object,
        updateProfile: React.PropTypes.func.isRequired
    },
    componentWillReceiveProps(nextProps){
        debug("componentWillReceiveProps", nextProps);
        this.setState(nextProps.profile);
    },
    getInitialState() {
        debug("getInitialState: props: ", this.props);
        return _.extend({}, this.props.profile);
    },
    render() {
        debug("render props: ", this.props);
        debug("state: ", this.state);
        let {errors} = this.props;
        let {state} = this;
        return (
            <form id="profile-form"
                className="form-horizontal"
                onSubmit={ (e) => e.preventDefault() }>
                <div className="col-sm-6">
                    <div>
                        <TextField
                            id='username'
                            ref="username"
                            hintText={tr.t('username')}
                            value={state.username}
                            onChange={_.partial(this.onChange, 'username')}
                            errorText={errors.username && errors.username[0]}
                            />
                    </div>
                    <br/>
                    <div>
                        <TextField
                            id='email'
                            ref="email"
                            disabled={true}
                            value={state.email}
                            hintText={tr.t('email')}
                            floatingLabelText={tr.t('email')}
                            errorText={errors.email && errors.email[0]}
                            />
                    </div>
                </div>

                <div className="col-sm-12">
                    <div className="form-group">
                        <legend>About Me</legend>
                        <TextArea
                            rows={4}
                            floatingLabelText={tr.t('email')}
                            onChange={_.partial(this.onChange, 'about')}
                            />
                    </div>
                </div>

                <div className="col-sm-12">
                    <div className="form-group">
                        <div className="btn-toolbar action-buttons">
                            <button className="btn btn-primary"
                            onClick={ this.onUpdateProfile }>Update Profile</button>
                        </div>
                    </div>
                </div>
            </form>
        );
    },
    onUpdateProfile(){
        debug("onUpdateProfile: ", this.state);
        this.props.updateProfile(this.state);
    },
    onChange(id, e) {
        debug(`onChange: ${id}: ${e.target.value}`);
        this.setState({[id]: e.target.value});
    }
} );
