import testMngr from '~/test/testManager';
import Server from './koaServer';
import Axios from 'axios';
import {assert} from 'chai';

describe('Koa', function(){
  const baseUrl = "http://localhost:9000";
  let server = Server(testMngr.app);
  it('start and stop ok', async () => {
    await server.start();
    await server.stop();
  });
  describe('Cors Middleware', function(){
    before(async () => {
      await server.start();
    });
    after(async () => {
      await server.stop();
    });
    it('cors ok', async () => {
      const origin = "http://localhost:8080";
      let res = await Axios({
        method: 'options',
        url: baseUrl + "/api/v1/me",
        headers: {
          Origin: origin,
          "Access-Control-Request-Headers": "Origin, Accept, Content-Type",
          "Access-Control-Request-Method": "GET"
        }
      });

      assert.equal(res.status, 204);
      const {headers} = res;
      assert.equal(headers['access-control-allow-origin'], origin);
      assert.equal(headers['access-control-allow-methods'], 'GET,HEAD,PUT,POST,DELETE');
      assert.equal(headers['access-control-allow-headers'], 'Origin, Accept, Content-Type');
      assert(headers['access-control-allow-credentials']);
    });
    it('cors ko', async () => {
      try {
        await Axios({
          method: 'options',
          url: baseUrl + "/api/v1/me",
          headers: {
            //Origin: origin,
            "Access-Control-Request-Headers": "Origin, Accept, Content-Type",
            "Access-Control-Request-Method": "GET"
          }
        });
        assert(false);
      } catch(error){
        assert.equal(error.response.status, 404);
        const {headers} = error.response;
        assert(!headers['access-control-allow-origin']);
        assert(!headers['access-control-allow-methods']);
        assert(!headers['access-control-allow-headers']);
        assert(!headers['access-control-allow-credentials']);
      }
    });
  });
});
