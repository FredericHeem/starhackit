import { createElement as h } from "react";
import createHello from "./Hello";

export default context => {
  const hello = createHello(context);
  function Routes() {
    return [
      {
        path: "/hello",
        action: routerContext => {
          hello.store.get();
          return {
            routerContext,
            title: "Hello",
            component: h(hello.view)
          };
        }
      }
    ];
  }

  return {
    stores: () => ({ hello: hello.store }),
    routes: () => Routes()
  };
};
