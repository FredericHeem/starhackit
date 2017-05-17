import React from 'react';
import navBar from '../../core/components/navbar';
import footer from '../../core/components/footer';
import { ThemeProvider } from 'glamorous';
import './application.styl';

// eslint-disable-next-line no-undef
const version = __VERSION__;

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
        <div id="application-view">
          <NavBar authenticated={authenticated} />
          <div id="main-container" className="container">
            {props.children}
          </div>
          <Footer version={version} />
        </div>
      </ThemeProvider>
    );
  }

  return ApplicationView;
};
