import React, {createElement as h}  from 'react';
import DocTitle from 'components/docTitle';
import page from 'components/Page';
import paper from 'components/Paper';
import spinner from 'components/spinner';
import alertAjax from 'components/alertAjax';
import Debug from 'debug';
const debug = new Debug('views:registrationComplete');

export default context => {
  const { tr } = context;
  const Page = page(context);
  const AlertAjax = alertAjax(context);

  function RegistrationComplete({ verifyEmailCode }) {
    debug('render ', verifyEmailCode);
    const Paper = paper(context);
    const { error } = verifyEmailCode;
    return (
      <Page className="registration-complete-page text-center">
        <DocTitle title={tr.t('Registering')} />
        <Paper>
          <h3>{tr.t('Registering your account')}</h3>
          <AlertAjax error={error} className="register-complete-error-view" />
          {' '}
          {!error && h(spinner(context))}
        </Paper>
      </Page>
    );
  }
  return RegistrationComplete;
};
