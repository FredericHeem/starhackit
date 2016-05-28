//import {expect} from 'chai';
import App from '../app';
import { render } from 'enzyme';

describe('App', () => {
  it('start', async () => {
    let app = App();
    await app.start();
    let container = app.createContainer()
    let wrapper = render(container);

  });
});
