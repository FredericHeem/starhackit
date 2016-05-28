import React from 'react';
import ReactDOM from 'react-dom';
import App from './app'

function render(view){
  let mountEl = document.getElementById('application');
  ReactDOM.render(
          <div>
              {view}
          </div>
          , mountEl);
}

try {
  let app = App(render);
  app.start();
  let container = app.createContainer();
  render(container)
} catch (e) {
  console.error('Error in app:', e);
}
