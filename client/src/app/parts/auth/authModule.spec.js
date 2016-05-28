import {assert} from 'chai';
import App from '../../app';

describe('Auth', function() {
  it('setToken', () => {
    let app = App();
    let {parts, store} = app;
    assert.isUndefined(store.getState().auth.token);
    let token = 'ASDFGHJKLL'
    store.dispatch(parts.auth.actions.setToken(token));
    assert.equal(store.getState().auth.token, token);
  });
});
