import App from '../app';
import { render } from 'enzyme';

describe('App', function() {
  it('start', async () => {
    let app = App();
    await app.start();
    let container = app.createContainer()
    let wrapper = render(container);
  });
});
