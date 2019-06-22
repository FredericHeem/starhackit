import tr from "i18next";
import { createBrowserHistory } from "history";
import formatter from "utils/formatter";
import alertStackCreate from "components/alertStack";
import Rest from "./utils/rest";
import palette from "./palette";
import intl from "utils/intl";
import I18n from "utils/i18n";

import rootConfig from "./config";

export default async option => {
  const config = { ...rootConfig, ...option.config };
  const context = {
    palette: palette(),
    tr,
    formatter: formatter("en"),
    history: createBrowserHistory(),
    config,
    parts: {}
  };
  context.alertStack = alertStackCreate(context, { limit: 3 });
  context.rest = Rest(context);

  const i18n = I18n({ debug: config.debug.i18n });
  const language = await i18n.load();
  context.formatter.setLocale(language);
  await intl(language);

  return context;
};
