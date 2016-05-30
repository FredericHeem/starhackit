import {assert} from 'chai';
import App from '../../app';

describe('Core', function() {
  it('default locale, set a new one', () => {
    let app = App();
    let {parts, store} = app;
    assert.equal(store.getState().core.language.locale, 'en');
    store.dispatch(parts.core.actions.setLocale('it'));
    assert.equal(store.getState().core.language.locale, 'it');
  });
});
