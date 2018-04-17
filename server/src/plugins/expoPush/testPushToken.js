import assert from "assert";
import testMngr from "~/test/testManager";
import Axios from "axios";

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
  it("should get all token for the current user", async () => {
    const body = {
      token: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
    };
    await client.post("v1/push_token/", body);
    await client.post("v1/push_token/", body);
    await client.post("v1/push_token/", body);
  });
  it("send message", async () => {
    const data = {
      to: "ExponentPushToken[8giJthMgGEyYUr8H5NsPWO]",
      title: "Someone apply",
      body: "Someone apply to your job"
    };
    await Axios({
      method: "post",
      url: "https://exp.host/--/api/v2/push/send",
      headers: {
        "Content-Type": "application/json"
      },
      data
    });

  });
});
