import { createElement as h } from "react";
import asyncView from "components/AsyncView";

export default ({context, parts}) => [
  {
    path: "/",
    children: [
      {
        path: "",
        action: () => ({
          title: "Home",
          component: h(asyncView(context), {
            getModule: () => import("./landing/landingScreen")
          })
        })
      },
      {
        path: "/guide",
        action: () => ({
          title: "Component Guide",
          component: h(asyncView(context), {
            getModule: () => import("components/componentGuide")
          })
        })
      },
      ...parts.auth.routes(),
      ...parts.db.routes(),
      ...parts.hello.routes()
    ]
  }
];
