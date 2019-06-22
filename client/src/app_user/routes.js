
import {createPart} from "../router"

export default ({ context, parts }) => [
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
      ...parts.auth.routes()
    ]
  }
];
