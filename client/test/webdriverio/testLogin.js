//import assert from 'assert';
//import testMngr from '~/test/testManager';
var webdriverio = require('webdriverio');

describe('Login', function() {
  var client = {};

  before(async () => {
          client = webdriverio.remote({ desiredCapabilities: {browserName: 'firefox'} });
          await client.init().url('http://localhost:8080')
  });
  after(async () => {
    await client.end();
  });
  it('get title', async () => {
    let title = await client.title();
    console.log('Title was: ' + title.value);
  });
  it('login', async () => {
    await client.url('http://localhost:8080/login')
      .setValue('input[placeholder=Email]', 'alice')
      .setValue('input[type=password]', 'password')
      .click('.btn-signup')

  });
});
