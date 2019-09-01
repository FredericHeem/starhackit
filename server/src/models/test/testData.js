//import * as assert from 'assert';
const testMngr = require('test/testManager');

describe('Data', function() {
  it('seedIfEmpty when already seeded', async () => {
    await testMngr.app.data.seedIfEmpty();
    await testMngr.app.data.seedIfEmpty();
  });
});
