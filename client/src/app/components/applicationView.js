import React, {createElement as h} from "react";
import { observer } from "mobx-react";
import glamorous from "glamorous";
import navBar from "./navbar";
import footer from "./footer";
import asyncView from "components/AsyncView";
// eslint-disable-next-line no-undef
const version = __VERSION__;

export default context => {
  const { theme, parts } = context;
  const { palette } = theme;
  const NavBar = navBar(context);
  const Footer = footer(context);
  const AsyncView = asyncView(context);

  const AppRoot = glamorous("div")({
    display: "flex",
    minHeight: '100vh'
  });

  const AppView = glamorous("div")(() => ({
    flex: "1 1 auto",
    display: "flex",
    flexDirection: 'column',
    overflow: "auto",
    color: palette.textPrimary
  }));

  const MainView = glamorous("main")({
    display: "flex",
    flex: "1",
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 50,
    "@media(max-width: 600px)": {
      margin: 10
    }
  });

  function ApplicationView({ authStore, themeStore, children }) {
    return (
      <AppRoot>
        <AppView>
          <NavBar authenticated={authStore.authenticated} />
          <MainView>
            {children}
          </MainView>
          <Footer version={version} />
        </AppView>
        {themeStore.open &&
          <AsyncView
            getModule={() => import("parts/theme/ThemeView")}
          />}
      </AppRoot>
    );
  }

  return ({ children }) =>
    h(observer(ApplicationView), {
      authStore: parts.auth.stores().auth,
      themeStore: parts.theme.stores().sideBar,
      children
    });
};
