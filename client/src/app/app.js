import 'assets/stylus/main';
import tr from 'i18next';
import Rest from './utils/rest';
import configureStore from './configureStore';

import AuthModule from './parts/auth/authModule';
import CoreModule from './parts/core/coreModule';
import ProfileModule from './parts/profile/profileModule';
import AdminModule from './parts/admin/adminModule';
import DbModule from './parts/db/dbModule';

import Debug from 'debug';
import 'utils/ga';
import formatter from 'utils/formatter';
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
    const context = {
        tr,
        formatter: formatter()
    }
    const rest = Rest();
    let auth = AuthModule(context, rest);
    const parts = {
      auth,
      core: CoreModule(context),
      profile: ProfileModule(context, rest),
      admin: AdminModule(context, rest),
      db: DbModule(context, rest)
    }

    const store = configureStore(parts);
    let jwt = Jwt(store);

    rest.setJwtSelector(jwt.selector(store));

    return {
        parts,
        store,
        createContainer(){
            return rootView(store, parts)
        },
        async start() {
            debug("start");
            const language = await i18n.load();
            context.formatter.setLocale(language);
            store.dispatch(parts.core.actions.setLocale(language))
            await intl(language);
            jwt.loadJWT(parts);
            store.dispatch(parts.auth.actions.me())
        }
    };
}
