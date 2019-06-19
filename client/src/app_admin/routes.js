export default ({parts}) => [
  {
    path: "/admin",
    children: [
      ...parts.auth.routes(),
      ...parts.users.routes()
    ]
  }
];
