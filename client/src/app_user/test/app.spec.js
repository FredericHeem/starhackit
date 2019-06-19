import { assert } from "chai";
import App from "../UserApp";

describe("App", function() {
  const app = App();
  it("start", async () => {
    await app.start();
  });
  it("parts", async () => {
    const { parts } = app.context;
    assert.isAbove(Object.keys(parts).length, 1);
  });
});
