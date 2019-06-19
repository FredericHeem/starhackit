import tr from "i18next";
import createBrowserHistory from "history/createBrowserHistory";
import formatter from "utils/formatter";
import alertStackCreate from "components/alertStack";
import Rest from "./utils/rest";
import theme from "./theme";

import rootConfig from "./config";

export default ({config, layout}) => {
  const context = {
    rest: Rest(),
    theme: theme(),
    tr,
    formatter: formatter("en"),
    history: createBrowserHistory(),
    config: {...rootConfig, ...config}
  };
  context.alertStack = alertStackCreate(context, { limit: 3 });
  return context;
};
