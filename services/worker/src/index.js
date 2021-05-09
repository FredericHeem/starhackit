const { main } = require("./worker");

main()
  .then(() => {
    console.log("running");
  })
  .catch((error) => console.error(`error:`, error));
