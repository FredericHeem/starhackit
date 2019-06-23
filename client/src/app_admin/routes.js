import {createPart} from "../router"

export default ({context}) => [
  {
    path: "/admin",
    children: [
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
