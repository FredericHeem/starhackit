import Context from "../context";
import App from "../app";
import AuthModule from "parts/auth/authModule";
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
    hello: HelloModule(context)
  };

  return App({ context, parts, createRoutes, layout });
};
