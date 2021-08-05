import { parse } from "qs";

export function redirect(history, config) {
  const nextPath =
    parse(window.location.search.slice(1)).nextPath || config.routeAfterLogin;
  console.log(`redirect to ${nextPath}`);
  history.push(nextPath);
}
