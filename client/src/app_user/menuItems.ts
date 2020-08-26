import { createElement as h } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";

export default () => [
  {
    route: "/user/profile",
    text: "PROFILE",
    icon: h(CgProfile),
  },
  {
    route: "/user/auth/logout",
    text: "LOGOUT",
    icon: h(BiLogOutCircle),
  },
];
