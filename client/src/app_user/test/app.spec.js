import { assert } from "chai";
import App from "../UserApp";

describe("App",  function() {
  let app;
  before(async () => {
    app = await App();
  })
 
  it("1 parts", async () => {
    assert(true)
  });
});
