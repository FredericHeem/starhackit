import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'utils/i18n';
import App from './app'
import Debug from 'debug';

const debug = new Debug("app.entry");

function render(view){
  const mountEl = document.getElementById('application');
  ReactDOM.render(
    <div>
      {view}
    </div>
          , mountEl);
}

function hideLoading(){
  const loadingEl = document.getElementById('loading');
  loadingEl.classList.add("m-fadeOut");
}

async function run(){
  try {
    const language = await i18n.load();
    const app = App({language});
    await app.start();
    const container = app.createContainer();
    hideLoading();
    render(container)
  } catch (e) {
    debug('Error in app:', e);
    throw e;
  }
}

run();
