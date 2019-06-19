import { createElement as h } from "react";
import createHello from "./Hello";

export default context => {
  const hello = createHello(context);
  function Routes() {
    return [
      {
        path: "/hello",
        action: () => {
          hello.store.get();
          return {
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
