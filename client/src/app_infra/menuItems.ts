import { createElement as h } from "react";
import { BiLogOutCircle } from "react-icons/bi";
import { CgProfile,CgCloud } from "react-icons/cg";

export default () => [
  {
    route: "/infra",
    text: "INFRA",
    icon: h(CgCloud),
  },
  {
    route: "/profile",
    text: "PROFILE",
    icon: h(CgProfile),
  },
  {
    route: "/auth/logout",
    text: "LOGOUT",
    icon: h(BiLogOutCircle),
  },
];
