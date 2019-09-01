console.log("api server started");
const App = require('./app');
let app = App();
app.displayInfoEnv();

app.start()
.catch(err => {
  console.error("App ending with error: ", err);
  console.error("App ending with error: ", JSON.stringify(err));
});
