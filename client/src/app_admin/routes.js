import {createPart} from "../router"

export default ({context, parts}) => [
  {
    path: "/admin",
    children: [
      ...parts.auth.routes(),
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
