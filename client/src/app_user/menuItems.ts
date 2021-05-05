import { createElement as h } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { CgProfile,CgCloud } from "react-icons/cg";

export default () => [
  {
    route: "/user/infra",
    text: "INFRA",
    icon: h(CgCloud),
  },
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
