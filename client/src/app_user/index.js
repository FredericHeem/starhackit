import App from "./UserApp";
App().then(app => require("../app").default(app))
