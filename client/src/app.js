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

export default async function({ context, createRoutes, layout }) {
  const routes = createRoutes({ context });
  const router = Router({ context, routes, layout });

  initialScreenFadeOut();

  router.start();

  return {
    context,
    router
  }
}
