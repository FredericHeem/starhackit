import React, { createElement as h } from "react";
import Router from "universal-router";
import asyncView from "components/AsyncView";
import { render } from "react-dom";
import { parse } from "qs";
import appView from "components/applicationView";

export default context => {
  const AlertStack = context.alertStack.View;
  const { tr, history, config } = context;
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

  const { parts } = context;
  const routes = [
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

  const router = new Router(routes, {
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
      return undefined;
    }
  });

  const onRenderComplete = route => {
    document.title = `${route.title} - ${config.title}`;
  };

  async function onLocationChange(location) {
    console.log("onLocationChange ", location);
    let component;
    let route;
    try {
      route = await router.resolve({
        pathname: location.pathname,
        query: parse(location.search)
      });
      console.log("onLocationChange match route ", route);
      component = route.component; // eslint-disable-line prefer-destructuring
    } catch (error) {
      console.log("Routing exception:", error.message);
      if (error.code === 404) {
        component = h(asyncView(context), {
          getModule: () => import("./components/notFound")
        });
        route = { title: tr.t("Page Not Found") };
      }
    }
    if (component) {
      const Layout = appView(context);
      const layout = (
        <Layout>
          {component}
          <AlertStack />
        </Layout>
      );
      context.rootInstance = render(
        layout,
        document.getElementById("application"),
        () => onRenderComplete(route, location)
      );
    }
  }

  history.listen(onLocationChange);
  return {
    start() {
      onLocationChange(history.location);
    }
  };
};
