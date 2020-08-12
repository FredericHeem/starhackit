import {createPart} from "../router"
import Layout from "./LayoutUnauthenticated"

export default ({context}) => [
  {
    path: "",
    children: [
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
      },
      {
        path: "/users",
        children: [],
        action: async routerContext =>
          createPart({
            name: "users",
            context,
            partCreate: await import("./users/usersModule"),
            routerContext
          })
      },
    ]
  }
];
