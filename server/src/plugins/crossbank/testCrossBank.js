import _ from 'lodash';
import Axios from 'axios';
import assert from 'assert';
import url, {URL} from 'url';
import testMngr from '~/test/testManager';
import jsdom from 'jsdom';
import config from 'config';

function OBClient(param){
  const axios = Axios.create({
    baseURL: param.baseURL,
    timeout: 30e3
  });

  return {
    async loginOauth(data){
      try {
        const result = await axios.get('crossBank/login');
        const res = result.request.res;
        //console.log("result.headers ", res.headers);
        assert.equal(res.statusCode, 302);
        assert(res.headers.location);
        assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');

        const formToken = await new Promise((resolve, reject) => {
          jsdom.env(
            result.data,
            ["http://code.jquery.com/jquery.js"],
            function (err, window) {
              if(err){
                return reject(err);
              }
              const token = window.$("input[type=submit]").attr('name');
              console.log("contents login hidden token:", token);
              resolve(token);
            }
          );
        });
        console.log("formToken ", formToken);
        const origin = new URL(res.headers.location).origin;
        console.log("origin ", origin);

        //TODO it should return a 302 but return a 200 with the login page.
        const resultLogin = await axios({
          method: 'POST',
          url: url.resolve(origin, '/user_mgt/login'),
          headers: {
            Referer: res.headers.location,
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            username: data.username,
            password: data.password,
            [formToken]: 'Login'
          }
        });

        console.log("resultLogin ", resultLogin);

      } catch(error){
        console.error("authenticate error", error);
      }
    }
  };
}

describe.skip('CrossBank', function() {
  let client;
  this.timeout(120e3);
  const obConfig = {
    baseURL: url.resolve(`http://localhost:${config.koa.port}`, `/api/v1/`)
  };

  const loginParam = {
    username: 'joe.bloggs@example.com',
    password: 'qwerty',
  };

  before(async () => {
      await testMngr.start();
      client = testMngr.client('alice');
      await client.post("v1/crossBank/my/logins/direct", loginParam);
      let user = await client.get('v1/crossBank/getCurrentUser');
      //console.log("user ", user);
      assert(user);
  });
  after(async () => {
      await testMngr.stop();
  });
  it('loginDirect KO', async () => {
    try {
        await client.post("v1/crossBank/my/logins/direct", {
            username: 'joe.bloggs@example.com',
            password: 'badpassword123!!',
          });
    } catch(error){
      assert(error.statusCode, 401);
      assert.equal(error.body.error, "OBP-20004: Invalid login credentials. Check username/password.");
    }
  });
  it('getCurrentUser', async () => {
    let user = await client.get('v1/crossBank/getCurrentUser');
    //console.log("user ", user);
    assert(user);
    assert(user.user_id);
    assert(user.email);
    assert(user.provider_id);
    assert(user.provider);
    assert(user.entitlements);
  });
  it('getBanks', async () => {
    const response = await client.get('v1/crossBank/banks');
    //console.log("banks ", response);
    const {banks} = response;
    assert(_.isArray(banks));
    assert(!_.isEmpty(banks));

    for(let bank of banks.slice(0, 2)) {
      //console.log("bank ", bank);
      const accountsResponse = await client.get(`v1/crossBank/banks/${bank.id}/accounts/private`);
      const {accounts = []} = accountsResponse;
      //console.log("accounts ", accountsResponse);
      for(let account of accounts.slice(0, 5)){
        //console.log("account  ", account);
        const txs = await client.get(`v1/crossBank/banks/${bank.id}/accounts/${account.id}/owner/transactions`);
        assert(txs);
        //console.log("transactions ", txs);
      }
    };
    console.log("DONE");
  });
  it('getAccountsByBank', async () => {
    const response = await client.get('v1/crossBank/banks/rbs/accounts/private');
    //console.log("accounts ", response);
    const {accounts} = response;
    assert(_.isArray(accounts));
    assert(!_.isEmpty(accounts));
  });
  it('getAccounts', async () => {
    const accounts = await client.get('v1/crossBank/accounts');
    //console.log("accounts ", accounts);
    assert(_.isArray(accounts));
    assert(!_.isEmpty(accounts));
    for(let account of accounts){
      //console.log("account ", account);
      assert(account.id);
      assert(account.bank_id);
      assert(account.views_available);
    }
  });
  it('loginOauth', async () => {
    const obClient = OBClient(obConfig);
    await obClient.loginOauth(loginParam);
  });
});
