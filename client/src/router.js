import React, { createElement as h } from "react";
import Router from "universal-router";
import { render } from "react-dom";
import { parse } from "qs";
import asyncView from "components/AsyncView";
import ErrorBoundary from "components/ErrorBoundary";

export function createPart({
  name,
  context,
  partParam,
  partCreate,
  routerContext,
}) {
  if (context.parts[name]) {
    return;
  }

  const part = partCreate.default(context, partParam);
  context.parts[name] = part;
  routerContext.route.children = part.routes();
  return routerContext.next();
}

export default ({ context, routes, layout }) => {
  const { tr, history, config } = context;
  const router = new Router(routes);
  const onRenderComplete = (title) => {
    document.title = `${title} - ${config.title}`;
  };

  const resolveRoute = async () => {
    try {
      return await router.resolve({
        pathname: location.pathname.replace(config.base, ""),
        query: parse(location.search),
      });
    } catch (error) {
      console.error("Routing exception:", error, "route", location.pathname); // eslint-disable-line no-console
      const component = h(asyncView(context), {
        getModule: () => import("./components/notFound"),
      });
      return { title: tr.t("Page Not Found"), component };
    }
  };

  async function onLocationChange(location) {
    const { title, component, layout: layoutOverride } = await resolveRoute();
    const Layout = layoutOverride || layout(context);

    if (component) {
      context.rootInstance = render(
        <ErrorBoundary>
          <Layout>{component}</Layout>
        </ErrorBoundary>,
        document.getElementById("application"),
        () => onRenderComplete(title, location)
      );
    }
  }

  history.listen(onLocationChange);

  return {
    instance: router,
    start() {
      onLocationChange(history.location);
    },
  };
};
