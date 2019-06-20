import Context from "../context";
import App from "../app";
import AuthModule from "parts/auth/authModule";
import DbModule from "parts/db/dbModule";
import HelloModule from "parts/hello/helloModule";
import createRoutes from "./routes";
import layout from "./Layout";

export default async () => {
  const context = await Context({
    config: {
      routeAfterLogin: "profile",
      title: "Starhackit"
    }
  });

  const parts = {
    auth: AuthModule(context),
    db: DbModule(context),
    hello: HelloModule(context)
  };

  return App({ context, parts, createRoutes, layout });
};
