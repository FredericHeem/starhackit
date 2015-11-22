import assert from 'assert';
import testMngr from '~/test/testManager';

import Server from './koaServer'
describe('Koa', function(){

  it('start and stop ok', async () => {
    let server = Server(testMngr.app);
    await server.start();
    await server.stop();
  });

});
