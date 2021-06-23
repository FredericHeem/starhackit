const testMngr = require("../src/test/testManager");

before(async function () {
  await testMngr.seed();
});
