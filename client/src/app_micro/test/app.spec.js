import { assert } from "chai";
import App from "../Micro";

describe("App", async function() {
  let app;
  beforeAll(async () => {
    app = await App();
  })
  it("/", async () => {
    const route = await app.router.instance.resolve("/");
    assert(route);
    //assert.equal(route.title, "Hello");
  });
});
