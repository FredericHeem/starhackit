import {assert} from 'chai';
import App from '../../app';

describe('Auth', function() {
  const app = App();
  const {parts, store} = app;
  const token = 'ASDFGHJKLL';
  const {actions} = parts.auth;
  const selectState = store => store.getState().auth;
  const isAuthenticated = store => selectState(store).auth.authenticated;
  const getToken = store => selectState(store).auth.token;

  it('setToken', () => {
    assert.isUndefined(getToken(store));
    store.dispatch(actions.setToken(token));
    assert.equal(getToken(store), token);
    store.dispatch(actions.setToken());
    assert.isUndefined(getToken(store));
  });
  it('login', () => {
    //console.log("DISPATCH:", JSON.stringify(store.getState()));

    store.dispatch(actions.login.ok({response: {token}}));
    //console.log("STORE:", store.getState())
    assert.equal(isAuthenticated(store), true);
    assert.equal(getToken(store), token);
  });
  it('logout ok', () => {
    store.dispatch(actions.logout.ok({response: {}}));
    assert.equal(isAuthenticated(store), false);
  });
  it('logout error', () => {
    store.dispatch(actions.login.ok({response: {token}}));
    store.dispatch(actions.logout.error({error: {response: {status: 401}}}));
    assert.equal(isAuthenticated(store), false);
    assert.isUndefined(getToken(store));
  });
});
