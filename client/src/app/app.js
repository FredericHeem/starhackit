import "assets/stylus/main";
import ReactDOM from "react-dom";
import Context from "./context";

import AuthModule from "./parts/auth/authModule";
import CoreModule from "./parts/core/coreModule";
import ProfileModule from "./parts/profile/profileModule";
import AdminModule from "./parts/admin/adminModule";
import DbModule from "./parts/db/dbModule";
import ThemeModule from "./parts/theme/themeModule";

import Debug from "debug";

import intl from "utils/intl";

import rootView from "./rootView";

const debug = new Debug("app");

export default function({ language = "en" }) {
  debug("App begins");

  const context = Context({ language });
  const { rest } = context;

  const parts = {
    theme: ThemeModule(context),
    auth: AuthModule(context),
    core: CoreModule(context),
    profile: ProfileModule(context),
    admin: AdminModule(context),
    db: DbModule(context)
  };
  context.parts = parts;

  rest.setJwtSelector(parts.auth.stores().auth.getToken);

  async function i18nInit() {
    context.formatter.setLocale(language);
    await intl(language);
  }

  async function preAuth() {
    const token = localStorage.getItem("JWT");
    if (token) {
      parts.auth.stores().auth.setToken(token);
    }
    await parts.auth.stores().me.fetch();
  }

  const createRootView = () => rootView(context, parts);
  return {
    parts,
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
