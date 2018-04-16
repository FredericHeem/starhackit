import assert from "assert";
import testMngr from "~/test/testManager";

describe("Candidate Job", function() {
  let client;
  before(async () => {
    await testMngr.start();
    client = testMngr.client("alice");
    await client.login();
  });
  after(async () => {
    await testMngr.stop();
  });
  it.only("should get all token for the current user", async () => {
    const body = {
      token: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
    };
    await client.post("v1/push_token/", body);
    await client.post("v1/push_token/", body);
    await client.post("v1/push_token/", body);
  });
  
});
