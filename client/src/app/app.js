import "assets/stylus/main";
import _ from "lodash";
import ReactDOM from "react-dom";
import Context from "./context";
import Store from "./configureStore";

import AuthModule from "./parts/auth/authModule";
import CoreModule from "./parts/core/coreModule";
import ProfileModule from "./parts/profile/profileModule";
import AdminModule from "./parts/admin/adminModule";
import DbModule from "./parts/db/dbModule";
import CrossBankModule from "./parts/crossbank/crossBankModule";
import AnalyticsModule from "./parts/analytics/AnalyticsModule";

import ThemeModule from "./parts/theme/themeModule";

import Debug from "debug";

import intl from "utils/intl";
import Jwt from "utils/jwt";

import rootView from "./rootView";

//Needed by material-ui
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

const debug = new Debug("app");

export default function({ language = "en", config }) {
  debug("App begins");

  const context = Context({ language });
  const { rest } = context;

  const parts = {
    theme: ThemeModule(context),
    auth: AuthModule(context),
    core: CoreModule(context),
    profile: ProfileModule(context),
    admin: AdminModule(context),
    db: DbModule(context),
    analytics: AnalyticsModule(context),
    crossbank: CrossBankModule(context)
  };
  context.parts = parts;

  const store = Store({ debug: _.get(config, "debug.redux") }).create(parts);
  const jwt = Jwt(store);

  rest.setJwtSelector(jwt.selector(store));

  async function i18nInit() {
    context.formatter.setLocale(language);
    store.dispatch(parts.core.actions.setLocale(language));
    await intl(language);
  }

  async function preAuth() {
    const token = localStorage.getItem("JWT");
    if (token) {
      store.dispatch(parts.auth.actions.setToken(token));
    }
    await parts.auth.stores().me.fetch();
  }

  const createRootView = () => rootView(context, store, parts);
  return {
    parts,
    store,
    createRootView,
    render() {
      context.rootInstance = ReactDOM.render(
        createRootView(),
        document.getElementById("application")
      );
    },
    async start() {
      debug("start");
      return Promise.all([i18nInit(), preAuth()]);
    }
  };
}
