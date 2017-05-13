import React from 'react';
import DocTitle from 'components/docTitle';
import Page from 'components/Page';
import Paper from 'components/Paper';
import Spinner from 'components/spinner';
import alertAjax from 'components/alertAjax';
import Debug from 'debug';
const debug = new Debug('views:registrationComplete');

export default context => {
  const { tr } = context;
  const AlertAjax = alertAjax(context);

  function RegistrationComplete({ verifyEmailCode }) {
    debug('render ', verifyEmailCode);
    const { error } = verifyEmailCode;
    return (
      <Page className="registration-complete-page text-center">
        <DocTitle title={tr.t('Registering')} />
        <Paper>
          <h3>{tr.t('Registering your account')}</h3>
          <AlertAjax error={error} className="register-complete-error-view" />
          {' '}
          {!error && <Spinner />}
        </Paper>
      </Page>
    );
  }
  return RegistrationComplete;
};
