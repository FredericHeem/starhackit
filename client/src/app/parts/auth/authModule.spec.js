import {assert} from 'chai';
import App from '../../app';

describe('Auth', function() {
  let app = App();
  let {parts, store} = app;
  const token = 'ASDFGHJKLL';
  let {actions} = parts.auth;
  let selectState = store => store.getState().auth;
  let isAuthenticated = store => selectState(store).auth.authenticated;
  let getToken = store => selectState(store).auth.token;

  it('setToken', () => {
    assert.isUndefined(getToken(store));
    store.dispatch(actions.setToken(token));
    assert.equal(getToken(store), token);
  });
  it('login', () => {
    store.dispatch(actions.login.ok({token: token}));
    assert.equal(isAuthenticated(store), true);
    assert.equal(getToken(store), token);
  });
  it('logout ok', () => {
    store.dispatch(actions.logout.ok());
    assert.equal(isAuthenticated(store), false);
  });
  it('logout error', () => {
    store.dispatch(actions.login.ok({token: token}));
    store.dispatch(actions.logout.error({status: 401}));
    assert.equal(isAuthenticated(store), false);
    assert.isUndefined(getToken(store));
  });
});
