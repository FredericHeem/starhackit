import { createElement as h } from "react";
import asyncView from "components/AsyncView";
import {createPart} from "../router"

export default ({context}) => [
  {
    path: "",
    children: [
      {
        path: "",
        action: routerContext => ({
          routerContext,
          title: "Home",
          component: h(asyncView(context), {
            getModule: () => import("./landing/landingScreen")
          })
        })
      },
      {
        path: "/guide",
        action: routerContext => ({
          routerContext,
          title: "Component Guide",
          component: h(asyncView(context), {
            getModule: () => import("components/componentGuide")
          })
        })
      },
      {
        path: "/hello",
        children: [],
        action: async routerContext =>
          createPart({
            name: "hello",
            context,
            partCreate: await import("parts/hello/Hello"),
            routerContext
          })
      },
      {
        path: "/auth",
        children: [],
        action: async routerContext =>
          createPart({
            name: "auth",
            context,
            partCreate: await import("parts/auth/authModule"),
            routerContext
          })
      }
    ]
  }
];
