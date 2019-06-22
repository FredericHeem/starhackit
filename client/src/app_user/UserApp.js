import Context from "../context";
import App from "../app";
import layout from "./layout";
import createRoutes from "./routes";
import AuthModule from "parts/auth/authModule";

export default async() => {
  const context = await Context({
    config: {
      routeAfterLogin: "profile",
      defaultPath: "profile",
      title: "Your Area"
    }
  });

  const parts = {
    auth: AuthModule(context),
  };

  return App({ context, parts, createRoutes, layout });
};
