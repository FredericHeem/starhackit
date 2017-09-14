import React, { createElement as h } from "react";
import { render } from "react-dom";
import { parse } from "qs";
import Router from "./router";
import appView from "components/applicationView";
import asyncView from "components/AsyncView";

export default context => {
  const AlertStack = context.alertStack.View;
  const { tr, history, config } = context;

  const onRenderComplete = route => {
    document.title = `${route.title} - ${config.title}`;
  };

  async function onLocationChange(location) {
    console.log("onLocationChange ", location);
    let component;
    let route;
    try {
      route = await Router(context).resolve({
        path: location.pathname,
        query: parse(location.search)
      });
      console.log("onLocationChange match route ", route);
      component = route.component;
    } catch (error) {
      console.log("Routing exception:", error.status);
      if (error.status === 404) {
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
  onLocationChange(history.location);
};
