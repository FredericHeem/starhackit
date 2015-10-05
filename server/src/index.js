console.log("api server started");
import App from './app';
let app = new App();

app.start()
.catch(err => {
  console.error("App ending with error: ", err);
});
