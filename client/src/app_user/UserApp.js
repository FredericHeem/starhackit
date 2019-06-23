import Context from "../context";
import App from "../app";
import layout from "./Layout";
import createRoutes from "./routes";

export default async () => {
  const context = await Context({
    config: {
      base: "/user",
      routeAfterLogin: "/user/profile",
      defaultPath: "/user/profile",
      title: "Your Area"
    }
  });

  return App({ context, routes: createRoutes({ context }), layout });
};
