console.log("api server started");

import pkg from '../package.json';
console.log("package.json: ");
console.log(pkg);
import App from './app';
let app = App();
app.displayInfoEnv();

app.start()
.catch(err => {
  console.error("App ending with error: ", err);
  console.error("App ending with error: ", JSON.stringify(err));
});
