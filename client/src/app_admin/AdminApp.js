import Context from "../context";
import App from "../app";
import layout from "./Layout";
import createRoutes from "./routes";

export default async () => {
  const context = await Context({
    config: {
      title: "Admin",
      routeAfterLogin: "/admin/users",
      defaultPath: "/admin/users"
    }
  });

  return App({ context, routes: createRoutes({ context }), layout });
};
