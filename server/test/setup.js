const testMngr = require("../src/test/testManager");

before(() => {
  return testMngr.seed();
});
