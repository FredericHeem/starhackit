import React from 'react';
import DocTitle from 'components/docTitle';
import Paper from 'material-ui/Paper';
import Spinner from 'components/spinner';
import alertAjax from 'components/alertAjax';
import Debug from 'debug';
const debug = new Debug("views:registrationComplete");

export default (context) => {
  const {tr} = context;
  const AlertAjax = alertAjax(context);

  function RegistrationComplete({verifyEmailCode}) {
    debug("render ", verifyEmailCode);
    const {error} = verifyEmailCode;
    return (
      <div className="registration-complete-page">
        <DocTitle title={tr.t("Registering")} />
        <Paper className="text-center view">
          <h3>{tr.t('Registering your account')}</h3>
          <AlertAjax error={error} className='register-complete-error-view' /> {!error && <Spinner />}
        </Paper>
      </div>
    );
  }
  return RegistrationComplete;
}
