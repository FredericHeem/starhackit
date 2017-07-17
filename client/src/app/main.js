import I18n from 'utils/i18n';
import App from './app';
import Debug from 'debug';
import config from 'config';
import Log from 'utils/log';

Log({ enable: config.debug.log });

const debug = new Debug('app.entry');

function hideLoading() {
  const loadingEl = document.getElementById('loading');
  loadingEl.classList.add('m-fadeOut');
}

async function run() {
  try {
    const i18n = I18n({ debug: config.debug.i18n });

    const language = await i18n.load();
    const app = App({ language, config });
    await app.start();
    hideLoading();
    app.render();
  } catch (e) {
    debug('Error in app:', e);
    throw e;
  }
}

export default run;
