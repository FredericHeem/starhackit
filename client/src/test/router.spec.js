import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import App from "../UserApp";

chai.use(chaiAsPromised);
const { expect, assert } = chai;

describe("Router", function() {
  const { router, context } = App({});
  it("/login", async () => {
    // console.log("CONTEXT ", context);
    const component = await router.instance.resolve("/login");
    assert(component);
    assert.equal(component.title, "Login");
  });
  it("/app/profile not authenticated", async () => {
    expect(router.instance.resolve("/profile")).to.be.rejectedWith(Error);
  });
  it.skip("/app/profile authenticated", async () => {
    context.parts.auth.stores().auth.authenticated = true;
    const route = await router.instance.resolve("/profile");
    assert.equal(route.title, "My Profile");
  });
});
