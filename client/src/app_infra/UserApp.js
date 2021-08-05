import Context from "../context";
import App from "../app";
import layout from "./Layout";
import createRoutes from "./routes";

export default async () => {
  const context = await Context({
    config: {
      loginPath: "/auth/login",
      routeAfterLogin: "/infra",
      defaultPath: "/infra",
      title: "GruCloud",
    },
  });

  return App({ context, routes: createRoutes({ context }), layout });
};
