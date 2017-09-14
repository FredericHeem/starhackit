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

  function createPart(partName, partCreate, routerContext){
    const part = partCreate.default(context);
    context.parts[partName] = part;
    routerContext.route.children = part.routes();
    return routerContext.next();
  }

  const { parts } = context;
  const routes = {
    path: "/",
    children: [
      {
        path: "/",
        component: () => ({
          title: "Home",
          component: h(AsyncView, { getModule:() => import("./parts/landing/landingScreen")})
        })
      },
      {
        path: "/guide",
        component: () => ({
          title: "Component Guide",
          component: h(AsyncView, { getModule:() => import("./components/componentGuide")})
        })
      },
      ...parts.auth.routes(),
      ...parts.db.routes(),
      ...parts.hello.routes(),
      {
        path: "/profile",
        children: [],
        load: async (routerContext) => {
          isAuthenticated(routerContext)
          const partCreate = await import("./parts/profile/profileModule")
          return createPart("profile", partCreate, routerContext);
        }
      },
      {
        path: "/users",
        children: [],
        load: async (routerContext) => {
          isAuthenticated(routerContext)
          const partCreate = await import("./parts/admin/adminModule");
          return createPart("admin", partCreate, routerContext);
        }
      }
    ]
  };

  return new Router(routes, {
    resolveRoute(routerContext, params) {
      const { route } = routerContext;
      //console.log("resolveRoute ", routerContext, params);

      if (typeof route.load === "function") {
        return route.load(routerContext);
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
