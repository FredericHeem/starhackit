import "./app.css";
import Context from "./context";

import AuthModule from "./parts/auth/authModule";
import CoreModule from "./parts/core/coreModule";
import DbModule from "./parts/db/dbModule";
import ThemeModule from "./parts/theme/themeModule";
import HelloModule from "./parts/hello/helloModule";

import Debug from "debug";

import intl from "utils/intl";

import Client from './client';

const debug = new Debug("app");

export default function({ language = "en" }) {
  debug("App begins");

  const context = Context({ language });
  const { rest } = context;

  const parts = {
    theme: ThemeModule(context),
    auth: AuthModule(context),
    core: CoreModule(context),
    db: DbModule(context),
    hello: HelloModule(context)
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

  return {
    context,
    render() {
      Client(context);
    },
    async start() {
      debug("start");
      return Promise.all([i18nInit(), preAuth()]);
    }
  };
}
