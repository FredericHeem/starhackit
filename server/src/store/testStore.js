import assert from "assert";
import Store from "./Store";
let config = require("config");

describe("Redis", function() {
  beforeEach(async function() {
    if (!config.redis) {
      console.log("SKIP redis test");
      this.skip();
    }
  });
  it("start and stop ok", async () => {
    let store = Store(config);
    await store.start();
    await store.stop();
  });
  it("start and stop not configured", async () => {
    let store = Store({});
    await store.start();
    await store.stop();
  });
  it("subscribe and publish", done => {
    (async () => {
      const CHANNEL = "mychannel";
      const MESSAGE = "Ciao";
      const subscriber = Store(config);
      await subscriber.start();
      const subCb = (channel, message) => {
        assert.equal(CHANNEL, channel);
        assert.equal(MESSAGE, message);
        done();
      };
      subscriber.subscribe(CHANNEL, subCb);
      const publisher = Store(config);
      await publisher.start();
      await publisher.publish(CHANNEL, MESSAGE);
    })();

    //await store.stop();
  });
});
