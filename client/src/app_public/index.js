import App from "./PublicApp";
App().then(app => require("../main").default(app))