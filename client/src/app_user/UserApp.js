import Context from "../context";
import App from "../app";
import layout from "./Layout";
import createRoutes from "./routes";

export default async () => {
  const context = await Context({
    config: {
      base: "/user",
      loginPath: "/user/auth/login",
      routeAfterLogin: "/user/infra",
      defaultPath: "/user/infra",
      title: "GruCloud",
    },
  });

  return App({ context, routes: createRoutes({ context }), layout });
};
