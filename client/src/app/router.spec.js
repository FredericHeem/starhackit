import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import Router from './router';
import App from './app';

chai.use(chaiAsPromised);
const {expect, assert} = chai;

describe('Router', function () {
    const {context} = App({});
    it('/login', async () => {
        const router = Router(context);
        const component = await router.resolve('/login');
        assert(component)
        assert.equal(component.title, "Login")
    });
    it('/app/profile not authenticated', async () => {
        const router = Router(context);
        expect(router.resolve('/profile')).to.be.rejectedWith(Error);
    });
    it('/app/profile authenticated', async () => {
        const router = Router(context);
        context.parts.auth.stores().auth.authenticated = true;
        const route = await router.resolve('/profile');
        assert.equal(route.title, "My Profile")
    });
});
