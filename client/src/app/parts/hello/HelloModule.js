import {createElement as h} from 'react';
import createHello from "./Hello";

export default context => {
  const hello = createHello(context);
  function Routes() {
    return [
      {
        path: "/hello",
        component: () => ({
          title: "Hello",
          component: h(hello.view)
        })
        //action: () => hello.store.get()
      }
    ];
  }

  return {
    stores: () => ({ hello: hello.store }),
    routes: () => Routes()
  };
};
