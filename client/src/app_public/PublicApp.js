import Context from "../context";
import App from "../app";
import createRoutes from "./routes";
import layout from "./Layout";

export default async () => {
  const context = await Context({
    config: {
      title: "Starhackit"
    }
  });

  return App({ context, routes: createRoutes({ context }), layout });
};
