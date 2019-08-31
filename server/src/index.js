console.log("api server started");
require('import-to-commonjs/dist/register');
//import * as pkg from '../package.json';
console.log("package.json: ");
//console.log(pkg);
const App = require('./app').default;
let app = App();
app.displayInfoEnv();

app.start()
.catch(err => {
  console.error("App ending with error: ", err);
  console.error("App ending with error: ", JSON.stringify(err));
});
