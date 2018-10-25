import tr from "i18next";
import createBrowserHistory from "history/createBrowserHistory";
import formatter from "utils/formatter";
import alertStackCreate from "components/alertStack";
import Rest from "./utils/rest";
import theme from "./theme";

import config from "./config";

export default ({ language = "en" }) => {
  const context = {
    rest: Rest(),
    theme: theme(),
    tr,
    formatter: formatter(language),
    history: createBrowserHistory(),
    config
  };
  context.alertStack = alertStackCreate(context, { limit: 3 });
  return context;
};
