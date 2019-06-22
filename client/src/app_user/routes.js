
import {createPart} from "../router"

export default ({ context }) => [
  {
    path: "/user",
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
            routerContext
          })
      }
    ]
  }
];
