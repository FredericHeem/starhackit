require('import-to-commonjs/dist/register');
const testMngr = require("../src/test/testManager");

before(() => {
  return testMngr.seed();
});
