import testMngr from "~/test/testManager";

before(async () => {
  await testMngr.seed();
});
