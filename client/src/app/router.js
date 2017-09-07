import { createElement as h } from "react";
import Router from "universal-router";
import asyncView from "components/AsyncView";

export default context => {
  const AsyncView = asyncView(context);

  function isAuthenticated({ url }) {
    console.log("isAuthenticated ", url)
    const { authenticated } = context.parts.auth.stores().auth;
    if (!authenticated) {
      setTimeout(() => context.history.push(`/login?nextPath=${url}`), 1);
      throw new Error({name: 'redirect', status: 302})
    } 
  }

  const { parts } = context;
  const routes = {
    path: "/",
    children: [
      {
        path: "/",
        component: () => ({
          title: "Home",
          component: h(AsyncView, { getModule:() => System.import("./parts/landing/landingScreen")})
        })
      },
      {
        path: "/guide",
        component: () => ({
          title: "Component Guide",
          component: h(AsyncView, { getModule:() => System.import("components/componentGuide")})
        })
      },
      ...parts.auth.routes(),
      ...parts.db.routes(),
      ...parts.hello.routes(),
      {
        path: "/app",
        children: parts.profile.routes(),
        action: isAuthenticated
      },
      {
        path: "/",
        children: parts.admin.routes(),
        action: isAuthenticated
      }
    ]
  };

  return new Router(routes, {
    resolveRoute(routerContext, params) {
      const { route } = routerContext;
      //console.log("resolveRoute ", routerContext, params);

      if (typeof route.load === "function") {
        return route.load();
      }
      if (typeof route.action === "function") {
        route.action(routerContext, params);
      }
      if (typeof route.component === "function") {
        return route.component(routerContext);
      }
      return null;
    }
  });
};
