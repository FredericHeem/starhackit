import 'assets/stylus/main';

import Rest from './utils/rest';
import configureStore from './configureStore';

import AuthModule from './parts/auth/authModule';
import CoreModule from './parts/core/coreModule';
import ProfileModule from './parts/profile/profileModule';
import AdminModule from './parts/admin/adminModule';

import Debug from 'debug';
import 'utils/ga';

import i18n from 'utils/i18n';
import intl from 'utils/intl';
import Jwt from 'utils/jwt';
import rootView from './redux/rootView';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

Debug.enable("*,-engine*,-sockjs-client*,-socket*");

let debug = new Debug("app");

export default function() {
    debug("App begins");
    const rest = Rest();
    let auth = AuthModule(rest);
    const parts = {
      auth,
      core: CoreModule(),
      profile: ProfileModule(rest),
      admin: AdminModule(rest)
    }

    const store = configureStore(parts);
    let jwt = Jwt(store);

    rest.setJwtSelector(jwt.selector(store));

    return {
        createContainer(){
            return rootView(store, parts)
        },
        async start() {
            debug("start");
            let language = await i18n.load(store, parts.core.actions);
            store.dispatch(parts.core.actions.setLocale(language))
            await intl(language);
            jwt.loadJWT(parts)
        }
    };
}
