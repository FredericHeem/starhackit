import Store from './Store';
let config = require('config');

describe('Redis', function(){
  it('start and stop ok', async () => {
    let store = Store(config);
    await store.start();
    await store.stop();
  });

});
