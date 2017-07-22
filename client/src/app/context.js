import tr from "i18next";
import createBrowserHistory from 'history/createBrowserHistory';
import Rest from "./utils/rest";
import theme from "./theme";
import formatter from "utils/formatter";
import notification from "./utils/notification";

export default ({ language = "en" }) => {
  const context = {
    rest: Rest(),
    theme: theme(),
    tr,
    formatter: formatter(language),
    notification: notification(),
    history: createBrowserHistory()
  };
  
  return context;
};
