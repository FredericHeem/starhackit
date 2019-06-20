import App from "./AdminApp";
App().then(app => require("../app").default(app))
