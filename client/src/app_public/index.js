import App from "./PublicApp";
App().then(app => require("../app").default(app))