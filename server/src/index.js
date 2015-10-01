console.log("api server started");
import app from './app';

app.start().catch(err => {
  console.error("App ending with error: ", err);
});
