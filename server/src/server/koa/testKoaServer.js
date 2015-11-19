import assert from 'assert';

import Server from './koaServer'
describe('Koa', function(){

  it('start and stop ok', async () => {
    let server = Server();
    await server.start();
    await server.stop();
  });

});
