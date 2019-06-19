import Context from "../context";
import App from "../app";
import layout from "./layout";
import createRoutes from "./routes";
import AuthModule from "parts/auth/authModule";
import ProfileModule from "./profile/profileModule";

export default () => {
  const context = Context({
    config: {
      routeAfterLogin: "profile",
      defaultPath: "profile",
      title: "User"
    }
  });

  const parts = {
    profile: ProfileModule(context),
    auth: AuthModule(context),
  };

  return App({ context, parts, createRoutes, layout });
};
