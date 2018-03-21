import Formatter from "./Formatter";
import Theme from "./Theme";
import secrets from "../../secrets.json";

export default () => ({
  formatter: Formatter(),
  tr: {
    t: text => text
  },
  theme: Theme(),
  rest: require("./rest").default(),
  stores: {},
  secrets
});
