import tr from "i18next";
import { createBrowserHistory } from "history";
import formatter from "utils/formatter";
import alertStackCreate from "components/alertStack";
import Rest from "./utils/rest";
import theme from "./theme";
import intl from "utils/intl";
import I18n from "utils/i18n";

import rootConfig from "./config";

export default async ({ config }) => {
  const context = {
    rest: Rest(),
    theme: theme(),
    tr,
    formatter: formatter("en"),
    history: createBrowserHistory(),
    config: { ...rootConfig, ...config }
  };
  context.alertStack = alertStackCreate(context, { limit: 3 });

  const i18n = I18n({ debug: context.config.debug.i18n });
  const language = await i18n.load();
  context.formatter.setLocale(language);
  await intl(language);

  return context;
};
