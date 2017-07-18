import {assert} from 'chai';
import App from '../app';
import { render } from 'enzyme';

describe('App', function() {
  const app = App({});
  it('start', async () => {
    await app.start();
    const container = app.createRootView()
    const wrapper = render(container);
    assert(wrapper)
  });
  it('parts', async () => {
    const {parts} = app;
    assert.isAbove(Object.keys(parts).length, 2)
    assert(parts.core)
  });
});
