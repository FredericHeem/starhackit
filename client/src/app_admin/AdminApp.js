import Context from "../context";
import App from "../app";
import layout from "./Layout";
import createRoutes from "./routes";
import AuthModule from "parts/auth/authModule";

export default async () => {
  const context = await Context({
    config: {
      title: "Admin",
      routeAfterLogin: "users",
      defaultPath: "users"
    }
  });

  const parts = {
    auth: AuthModule(context),
  };

  return App({ context, parts, createRoutes, layout });
};
