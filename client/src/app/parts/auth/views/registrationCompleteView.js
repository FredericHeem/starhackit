import React from 'react';
import tr from 'i18next';
import DocTitle from 'components/docTitle';
import Paper from 'material-ui/Paper';
import Spinner from 'components/spinner';
import Alert from 'components/alert';
import Debug from 'debug';
let debug = new Debug("views:registrationComplete");

RegistrationError.propTypes = {
  error: React.PropTypes.object.isRequired
};

function RegistrationError({error}){
    if (error.data && error.data.name === 'NoSuchCode') {
        return (
          <Alert
              type='warning'
              className='registration-code-invalid'
              message={tr.t('The email verification code is no longer valid.')}/>
        );
    } else {
        //TODO
        <Alert
            type='danger'
            className='registration-error'
            message={tr.t('An error occured')}/>
    }
}

RegistrationComplete.propTypes = {
  verifyEmailCode: React.PropTypes.object.isRequired
};

export default function RegistrationComplete(props) {
    debug("render ", props);
    let {error} = props.verifyEmailCode;
    return (
        <div className="registration-complete-page">
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
