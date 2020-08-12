
import {createPart} from "../router"
import Layout from "./LayoutUnauthenticated"

export default ({ context }) => [
  {
    path: "",
    children: [
      {
        path: "/profile",
        children: [],
        action: async routerContext =>
          createPart({
            name: "profile",
            context,
            partCreate: await import("./profile/profileModule"),
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
            routerContext,
            partParam: {Layout}
          })
      }
    ]
  }
];
