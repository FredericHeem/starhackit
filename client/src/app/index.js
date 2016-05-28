import App from './app'
let app = App();
try {
  app.start();
} catch(e){
  console.error('Error in app:', e);
}
