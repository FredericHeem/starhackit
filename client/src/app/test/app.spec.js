import {assert} from 'chai';
import App from '../app';
import { render } from 'enzyme';

describe('App', function() {
  let app = App();
  it('start', async () => {
    await app.start();
    let container = app.createContainer()
    let wrapper = render(container);
    assert(wrapper)
  });
  it('parts', async () => {
    let {parts} = app;
    assert.isAbove(Object.keys(parts).length, 2)
    assert(parts.core)
  });
  it('store', async () => {
    let {store} = app;
    assert(store.getState())
  });
});
