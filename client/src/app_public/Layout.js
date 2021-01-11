import React, { createElement as h } from "react";
import { observer } from "mobx-react";
import navBar from "components/navbar";
import footer from "components/footer";
import authBar from "components/authBar";
import RootView from "components/RootView";
import MainView from "components/MainView";
import APP_MENU from "./menuItems";

export default (context) => {
  const {
    alertStack: { View: AlertStack },
  } = context;

  const NavBar = navBar(context);
  const Footer = footer(context);
  const AuthBar = authBar(context);

  const Layout = ({ children }) => (
    <RootView>
      <NavBar appMenu={APP_MENU()} right={AuthBar} />
      <MainView>{children}</MainView>
      <Footer />
      <AlertStack />
    </RootView>
  );

  return ({ children }) =>
    h(observer(Layout), {
      children,
    });
};
