import Debug from "debug";

const debug = new Debug("intl");

export default async function(language = "en") {
  debug(language);
  if (!window.Intl) {
    // Safari only
    debug("fetch intl");
    await import("intl");
    await import("intl/locale-data/jsonp/en.js");
  }
}
