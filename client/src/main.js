import Debug from "debug";
import Log from "utils/log";
import config from "./config";

Log({ enable: config.debug.log });

const debug = new Debug("app.entry");

function hideLoading() {
  const loadingEl = document.getElementById("loading");
  loadingEl.classList.add("m-fadeOut");
}

async function run(app) {
  try {
    await app.start();
    hideLoading();
    app.render();
  } catch (e) {
    debug("Error in app:", e);
    throw e;
  }
}

export default run;
