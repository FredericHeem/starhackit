import React, { createElement as h } from "react";
import Router from "universal-router";
import { render } from "react-dom";
import { keyframes } from "glamor";

import { parse } from "qs";
import appView from "components/applicationView";
import asyncView from "components/AsyncView";

import createRoutes from "./routes";

import Animate from "react-leanimate/Animate";

const animation = {
  showFromLeft: keyframes({
    "0%": { transform: "translateX(-50%)", opacity: 0 },
    "100%": { transform: "translateX(0%)", opacity: 1 }
  }),
  hideToRight: keyframes({
    "0%": { transform: "translateX(0%)", opacity: 1 },
    "100%": { transform: "translateX(50%)", opacity: 0 }
  })
};

export default context => {
  const { tr, history, config } = context;

  const router = new Router(createRoutes(context), {
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
    //console.log("onLocationChange ", location);
    let component;
    let route;
    try {
      route = await router.resolve({
        pathname: location.pathname,
        query: parse(location.search)
      });
      component = route.component; // eslint-disable-line prefer-destructuring
    } catch (error) {
      console.error("Routing exception:", error.message);
      if (error.code === 404) {
        component = h(asyncView(context), {
          getModule: () => import("./components/notFound")
        });
        route = { title: tr.t("Page Not Found") };
      }
      //TODO display error message
    }
    if (component) {
      const Layout = appView(context);
      const layout = (
        <Layout>
          <Animate
            component={component}
            animationHide={`${animation.hideToRight} 0.3s`}
            animationShow={`${animation.showFromLeft} 0.5s`}
          />
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
    instance: router,
    start() {
      onLocationChange(history.location);
    }
  };
};
