import React from 'react';
import glamorous, { ThemeProvider } from 'glamorous';
import navBar from '../../core/components/navbar';
import footer from '../../core/components/footer';

// eslint-disable-next-line no-undef
const version = __VERSION__;

const AppView = glamorous('div')({

})

const MainView = glamorous('div')({
  paddingTop: 20,
  paddingBottom: 20,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
})

export default context => {
  const {theme} = context;
  const NavBar = navBar(context);
  const Footer = footer(context);

  console.log("theme: ", theme);

  function ApplicationView(
    {
      authenticated,
      ...props
    },
  ) {
    return (
      <ThemeProvider theme={theme}>
        <AppView>
          <NavBar authenticated={authenticated} />
          <MainView>
            {props.children}
          </MainView>
          <Footer version={version} />
        </AppView>
      </ThemeProvider>
    );
  }

  return ApplicationView;
};
