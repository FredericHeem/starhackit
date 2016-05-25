import _ from 'lodash';
import React from 'react';

import Checkit from 'checkit';
import TextField from 'material-ui/TextField';
import TextArea from 'react-textarea-autosize';
import LaddaButton from 'react-ladda';
//import SelectLangage from 'components/selectLanguage';
import ValidateProfileForm from 'services/validateProfileForm';
import Spinner from 'components/spinner';
import Paper from 'material-ui/Paper';
import tr from 'i18next';
import Debug from 'debug';
let debug = new Debug("components:profileForm");

export default React.createClass({
    propTypes: {
        profile: React.PropTypes.object,
    },
    getDefaultProps(){
        return {
            loading: false,
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
            updating: false,
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

                <h3>My Profile</h3>
                <div className="">
                        <TextField
                            id='username'
                            floatingLabelText={tr.t('username')}
                            value={state.username}
                            disabled={true}
                            onChange={_.partial(this.onChange, 'username')}
                            errorText={errors.username && errors.username[0]}
                            />
                        <TextField
                            id='email'
                            value={state.email}
                            disabled={true}
                            floatingLabelText={tr.t('email')}
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
                        <legend>About Me</legend>
                        <TextArea
                            style={{width:'100%'}}
                            classsName='text-center text-area'
                            rows={4}
                            floatingLabelText={tr.t('email')}
                            onChange={_.partial(this.onChange, 'about')}
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
                        onClick={this.onUpdateProfile}>Update Profile</LaddaButton>
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
            errors: {},
            updating: true
        } );

        validateForm.call( this )
            .with( this )
            .then( save )
            .then( successNotification )
            .catch(Checkit.Error, (error) => this.setState( {
                errors: error.toJSON()
            } ))
            .catch( setErrors )
            .then( () => {
                this.setState( {
                    updating: false
                } );
            } );

        function validateForm() {
            return new ValidateProfileForm( {
                username: this.state.username,
            } )
            .execute();
        }

        function save() {
            return this.props.actions.update(this.state);
        }

        function successNotification() {
        }

        function setErrors( e ) {
            debug('setErrors: ', e);
        }
    }
} );
