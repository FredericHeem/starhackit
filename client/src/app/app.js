import 'assets/stylus/main';
import tr from 'i18next';
import Rest from './utils/rest';
import configureStore from './configureStore';

import AuthModule from './parts/auth/authModule';
import CoreModule from './parts/core/coreModule';

import ProfileModule from './parts/profile/profileModule';
import AdminModule from './parts/admin/adminModule';
import DbModule from './parts/db/dbModule';
import CrossBankModule from './parts/crossbank/crossBankModule';
import AnalyticsModule from './parts/analytics/AnalyticsModule';

import Debug from 'debug';
import formatter from 'utils/formatter';
import intl from 'utils/intl';
import Jwt from 'utils/jwt';
import rootView from './redux/rootView';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

Debug.enable("*,-engine*,-sockjs-client*,-socket*");

const debug = new Debug("app");

export default function({language = 'en'}) {
    debug("App begins");

    const rest = Rest();
    const context = {
      tr,
      formatter: formatter()
    }

    const partOptions = {
      context,
      rest,
    }

    const parts = {
      auth: AuthModule(partOptions),
      core: CoreModule(partOptions),
      profile: ProfileModule(partOptions),
      admin: AdminModule(partOptions),
      db: DbModule(partOptions),
      analytics: AnalyticsModule(partOptions),
      crossbank: CrossBankModule(partOptions)
    }

    const store = configureStore(parts);
    const jwt = Jwt(store);

    rest.setJwtSelector(jwt.selector(store));

    async function i18nInit() {
      context.formatter.setLocale(language);
      store.dispatch(parts.core.actions.setLocale(language))
      await intl(language);
    }

    async function preAuth() {
      const token = localStorage.getItem("JWT");
      if (token) {
        store.dispatch(parts.auth.actions.setToken(token))
      }
      await parts.auth.stores().me.fetch();
    }

    return {
        parts,
        store,
        createContainer(){
            return rootView(context, store, parts)
        },
        async start() {
            debug("start");
            return Promise.all([
              i18nInit(),
              preAuth()
            ]);
        }
    };
}
