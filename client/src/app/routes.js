import { createElement as h } from "react";
import asyncView from "components/AsyncView";

export default context => {
  const {parts} = context;
  const AsyncView = asyncView(context);

  function isAuthenticated({ pathname }) {
    console.log("isAuthenticated ", pathname);
    const { authenticated } = context.parts.auth.stores().auth;
    if (!authenticated) {
      setTimeout(() => context.history.push(`/login?nextPath=${pathname}`), 1);
      throw new Error({ name: "redirect", status: 302 });
    }
  }

  function createPart(partName, partCreate, routerContext) {
    const part = partCreate.default(context);
    context.parts[partName] = part;
    routerContext.route.children = part.routes();
    return routerContext.next();
  }

  return [
    {
      path: "",
      component: () => ({
        title: "Home",
        component: h(AsyncView, {
          getModule: () => import("./parts/landing/landingScreen")
        })
      })
    },
    {
      path: "/guide",
      component: () => ({
        title: "Component Guide",
        component: h(AsyncView, {
          getModule: () => import("./components/componentGuide")
        })
      })
    },
    ...parts.auth.routes(),
    ...parts.db.routes(),
    ...parts.hello.routes(),
    {
      path: "/profile",
      children: [],
      load: async routerContext => {
        isAuthenticated(routerContext);
        const partCreate = await import("./parts/profile/profileModule");
        return createPart("profile", partCreate, routerContext);
      }
    },
    {
      path: "/users",
      children: [],
      load: async routerContext => {
        isAuthenticated(routerContext);
        const partCreate = await import("./parts/admin/adminModule");
        return createPart("admin", partCreate, routerContext);
      }
    }
  ];
};
