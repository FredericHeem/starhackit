const assert = require("assert");
const testMngr = require("test/testManager");
const Axios = require("axios");
const { sendToUser } = require("./sendNotification");
//TODO error Request failed with status code 503
describe("Expo Push Notification", function () {
  let client;
  let modelsUser;
  let modelsExpo;
  before(async function () {
    if (!testMngr.app.config.expo) {
      this.skip();
    }
    modelsUser = testMngr.app.plugins.get().users.models;
    modelsExpo = testMngr.app.plugins.get().expo.models;
    client = testMngr.client("alice");
    await client.login();
  });
  it("should get all token for the current user", async () => {
    const body = {
      token: "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    };
    await client.post("v1/push_token/", body);
    await client.post("v1/push_token/", body);
    await client.post("v1/push_token/", body);
  });
  it("send message", async () => {
    const data = {
      to: "ExponentPushToken[8giJthMgGEyYUr8H5NsPWO]",
      title: "Someone apply",
      body: "Someone apply to your job",
    };
    await Axios({
      method: "post",
      url: "https://exp.host/--/api/v2/push/send",
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
  });
  it("send to user", async () => {
    const user = await modelsUser.user.findOne({
      where: { email: "alice@mail.com" },
    });
    assert(user);
    const user_id = user.user_id;
    await modelsExpo.pushToken.upsert({
      token: "ExponentPushToken[8giJthMgGEyYUr8H5NsPWO]",
      user_id,
    });
    const res = await sendToUser(modelsExpo, user_id, {
      title: "test notif",
      body: "Ciao ciccio",
      sound: "default",
    });
  });
});
