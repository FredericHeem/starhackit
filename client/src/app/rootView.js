import React from 'react';
import Alert from 'react-s-alert';
import { browserHistory, Router } from 'react-router';
import Routes from './routes'

import Debug from 'debug';
const debug = new Debug("rootView");

function createRouter(routes) {
  const history = browserHistory;

  history.listen(location => {
    debug('routing to ', location)
  })

  return <Router history={history} routes={routes} />
}

export default function RootView(context, parts) {
  debug('init');
  const routes = Routes(context, parts)
  const Router = createRouter(routes);
  return (
    <div style={{ height: '100%' }}>
      {Router}
      <Alert stack={{ limit: 3 }} />
    </div>
  )
}
