import React from "react";
import { observer } from "mobx-react";
import glamorous, { ThemeProvider } from "glamorous";
import navBar from "../../core/components/navbar";
import footer from "../../core/components/footer";
import themer from "../../theme/ThemeView";
// eslint-disable-next-line no-undef
const version = __VERSION__;

export default context => {
  const { theme } = context;
  const { palette } = theme;
  const NavBar = navBar(context);
  const Footer = footer(context);
  const Themer = themer(context);

  const AppRoot = glamorous("div")({
    height: "100vh",
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

  function ApplicationView({
    authStore,
    themeStore,
    children
  }) {
    console.log("App View: ");
    return (
      <ThemeProvider theme={theme}>
        <AppRoot>
          <AppView>
            <NavBar authenticated={authStore.authenticated} />
            <MainView>
              {children}
            </MainView>
            <Footer version={version} />
          </AppView>
          {themeStore.open && <Themer />}
        </AppRoot>

      </ThemeProvider>
    );
  }

  return observer(ApplicationView);
};
