import React from 'react';
import tr from 'i18next';
import DocTitle from 'components/docTitle';
import Paper from 'material-ui/Paper';
import Spinner from 'components/spinner';
import AlertAjax from 'components/alertAjax';
import Debug from 'debug';
let debug = new Debug("views:registrationComplete");

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
                <AlertAjax error={error} className='register-complete-error-view'/>
                {!error && <Spinner/>}
            </Paper>
        </div>
    );
}
