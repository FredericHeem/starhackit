import Context from "../context";
import App from "../app";
import layout from "./Layout";
import createRoutes from "./routes";

export default async () => {
  const context = await Context({
    config: {
      title: "Admin",
      routeAfterLogin: "/admin/users",
      defaultPath: "users"
    }
  });

  const parts = {
  };

  return App({ context, parts, createRoutes, layout });
};
