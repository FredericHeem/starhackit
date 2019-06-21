import "./app.css";
import Router from "./router";
import Log from "utils/log";
import config from "./config";

Log({ enable: config.debug.log });

const initialScreenFadeOut = () => {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.classList.add("m-fadeOut");
  }
}

export default async function({ context, parts, createRoutes, layout }) {
  context.parts = parts;

  async function preAuth() {
    const token = localStorage.getItem("JWT");
    if (token) {
      parts.auth.stores().auth.setToken(token);
    }
    await parts.auth.stores().me.fetch();
  }

  const routes = createRoutes({ context, parts });
  const router = Router({ context, routes, layout });

  await Promise.all([preAuth()]);

  initialScreenFadeOut();

  router.start();

  return {
    context,
    router
  }
}
