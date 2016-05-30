import {assert} from 'chai';
import App from '../../app';

describe('Auth', function() {
  let app = App();
  let {parts, store} = app;
  const token = 'ASDFGHJKLL'
  it('setToken', () => {
    assert.isUndefined(store.getState().auth.token);
    store.dispatch(parts.auth.actions.setToken(token));
    assert.equal(store.getState().auth.token, token);
  });
  it('login', () => {
    store.dispatch(parts.auth.actions.login.ok({token: token}));
    assert.equal(store.getState().auth.authenticated, true);
    assert.equal(store.getState().auth.token, token);
  });
  it('logout ok', () => {
    store.dispatch(parts.auth.actions.logout.ok());
    assert.equal(store.getState().auth.authenticated, false);
  });
  it('logout error', () => {
    store.dispatch(parts.auth.actions.login.ok({token: token}));
    store.dispatch(parts.auth.actions.logout.error());
    assert.equal(store.getState().auth.authenticated, false);

  });
});
