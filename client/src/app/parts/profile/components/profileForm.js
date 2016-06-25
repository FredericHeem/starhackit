import _ from 'lodash';
import React from 'react';
import Checkit from 'checkit';
import TextField from 'material-ui/TextField';
import TextArea from 'react-textarea-autosize';
import LaddaButton from 'react-ladda';
//import SelectLangage from 'components/selectLanguage';
import Spinner from 'components/spinner';
import Paper from 'material-ui/Paper';
import tr from 'i18next';
import Debug from 'debug';
let debug = new Debug("components:profileForm");

import rules from 'services/rules';

let rulesProfile = new Checkit( {
    bio: rules.bio
} );

export default React.createClass({
    disaplyName:'ProfileForm',
    propTypes: {
        profileUpdate: React.PropTypes.object,
        profile: React.PropTypes.object,
        actions: React.PropTypes.object
    },
    getDefaultProps(){
        return {
            profile: {}
        }
    },
    componentWillReceiveProps(nextProps){
        debug("componentWillReceiveProps", nextProps);
        this.setState(nextProps.profile.data || {});
    },
    getInitialState() {
        debug("getInitialState: props: ", this.props);
        return {
            language: 'US',
            errors: {},
            completed:0
        }
    },
    render() {
        debug("render props: ", this.props);
        debug("state: ", this.state);
        let {state, props} = this;
        let {errors} = state;
        if(props.profile.loading){
            return <Spinner/>
        }
        return (

            <Paper className='profile-view view'>
            <form
                className="form-horizontal"
                onSubmit={ (e) => e.preventDefault() }>

                <h3>{tr.t('My Profile')}</h3>
                <div className="">
                        <TextField
                            id='username'
                            floatingLabelText={tr.t('Username')}
                            value={state.username}
                            disabled={true}
                            onChange={_.partial(this.onChange, 'username')}
                            errorText={errors.username && errors.username[0]}
                            />
                        <TextField
                            id='email'
                            value={state.email}
                            disabled={true}
                            floatingLabelText={tr.t('Email')}
                            errorText={errors.email && errors.email[0]}
                            />
                </div>
                <br/>

                {/*
                    <div className="form-group">
                        <label htmlFor="select-language" className="col-sm-3 control-label">Language</label>
                        <div className="col-sm-9">
                            <SelectLangage
                                id='select-language'
                                language={state.language}
                                onLanguage={this.onLanguage}/>
                        </div>
                    </div>
                    */}

                <div>
                    <div>
                        <legend>{tr.t('About Me')}</legend>
                        <TextArea
                            style={{width:'100%'}}
                            classsName='text-center text-area'
                            rows={4}
                            floatingLabelText={tr.t('Email')}
                            onChange={_.partial(this.onChange, 'bio')}
                            />
                    </div>
                </div>

                <div className='text-center btn-container'>
                    <LaddaButton
                        id='btn-update-profile'
                        className='btn btn-lg btn-primary'
                        buttonColor='green'
                        progress={.5}
                        loading={this.props.profileUpdate.loading}
                        buttonStyle="slide-up"
                        onClick={this.onUpdateProfile}>{tr.t('Update Profile')}</LaddaButton>
                    </div>
            </form>
        </Paper>
        );
    },

    onLanguage(language){
        debug("onLanguage: ", language);
        this.setState({language:language});
    },

    onChange(id, e) {
        debug(`onChange: ${id}: ${e.target.value}`);
        this.setState({[id]: e.target.value});
    },
    onUpdateProfile() {
        debug('updateProfile ', this.state);
        this.setState( {
            errors: {}
        } );
        let payload = {
            bio: this.state.bio
        }

        rulesProfile.run(payload)
            .then( this.props.actions.update )
            .then( successNotification )
            .catch( error => {
                if ( error instanceof Checkit.Error ) {
                    this.setState({errors: error.toJSON()})
                }
            } )

        function successNotification() {
            debug('updateProfile done');
            return true;
        }
    }
} );
