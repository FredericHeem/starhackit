import { assert } from "chai";
import App from "../UserApp";

describe("App", async function() {
  let app;
  beforeAll(async () => {
    app = await App();
  })
 
  it("parts", async () => {
    const { parts } = app.context;
    assert.isAbove(Object.keys(parts).length, 1);
  });
});
