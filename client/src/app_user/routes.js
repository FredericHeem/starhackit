export default ({parts}) => [
  {
    path: "/user",
    children: [
      ...parts.profile.routes(),
      ...parts.auth.routes()
    ]
  }
];
