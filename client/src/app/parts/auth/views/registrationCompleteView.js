import React, {createElement as h}  from 'react';
import {observer} from 'mobx-react';
import page from 'components/Page';
import paper from 'components/Paper';
import spinner from 'components/spinner';
import alertAjax from 'components/alertAjax';

export default context => {
  const { tr } = context;
  const Page = page(context);
  const AlertAjax = alertAjax(context);

  function RegistrationComplete({ store }) {
    const Paper = paper(context);
    const { error } = store.op;
    return (
      <Page className="registration-complete-page text-center">
        <Paper>
          <h3>{tr.t('Registering your account')}</h3>
          <AlertAjax error={error} className="register-complete-error-view" />
          {' '}
          {!error && h(spinner(context))}
        </Paper>
      </Page>
    );
  }
  return observer(RegistrationComplete);
};
