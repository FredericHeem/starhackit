import React from "react";
import { observer } from "mobx-react";
import glamorous from "glamorous";
import AsyncRoute from "preact-async-route";
import navBar from "../../core/components/navbar";
import footer from "../../core/components/footer";
// eslint-disable-next-line no-undef
const version = __VERSION__;

export default context => {
  const { tr, theme } = context;
  const { palette } = theme;
  const NavBar = navBar(context);
  const Footer = footer(context);

  function getTheme() {
    return System.import("../../theme/ThemeView").then(module =>
      module.default(context)
    );
  }

  const AppRoot = glamorous("div")({
    display: "flex"
  });

  const AppView = glamorous("div")(() => ({
    flex: "1 1 auto",
    overflow: "auto",
    color: palette.textPrimary
  }));

  const MainView = glamorous("div")({
    paddingTop: 20,
    paddingBottom: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
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
          <AsyncRoute
            getComponent={getTheme}
            loading={() => (<div>{tr.t("Loading")}</div>)}
          />}
      </AppRoot>
    );
  }

  return observer(ApplicationView);
};
