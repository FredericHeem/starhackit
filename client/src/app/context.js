import tr from "i18next";
import { browserHistory } from "react-router";
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
    history: browserHistory
  };
  
  return context;
};
