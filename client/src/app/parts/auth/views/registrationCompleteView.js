import React from 'react';
import tr from 'i18next';
import DocTitle from 'components/docTitle';
import Paper from 'material-ui/Paper';
import Spinner from 'components/spinner';
import Debug from 'debug';
let debug = new Debug("views:registrationComplete");

RegistrationError.propTypes = {
  error: React.PropTypes.object.isRequired
};

function RegistrationError({error}){
    if (error.data && error.data.name === 'NoSuchCode') {
        return (
            <div className="alert alert-warning text-center" role="alert">
                {tr.t('The email verification code is no longer valid.')}
            </div>
        );
    } else {
        //TODO
        return (
            <div className="alert alert-danger text-center" role="alert">
                {tr.t('An error occured')}
            </div>
        );
    }
}

RegistrationComplete.propTypes = {
  verifyEmailCode: React.PropTypes.object.isRequired
};

export default function RegistrationComplete(props) {
    debug("render ", props);
    let {error} = props.verifyEmailCode;
    return (
        <div id="registration-complete">
            <DocTitle
                title="Registering"
            />
            <Paper className="text-center view">
                <h3>{tr.t('Registering your account')}</h3>
                {error && <RegistrationError error={error}/>}
                {!error && <Spinner/>}
            </Paper>
        </div>
    );
}
