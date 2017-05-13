import React from 'react';
import navBar from '../../core/components/navbar';
import footer from '../../core/components/footer';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { ThemeProvider } from 'glamorous';
import './application.styl';

const muiTheme = getMuiTheme(baseTheme);
//console.log("theme: ", baseTheme);

// eslint-disable-next-line no-undef
const version = __VERSION__;

export default context => {
  const NavBar = navBar(context);
  const Footer = footer(context);

  function ApplicationView(
    {
      authenticated,
      ...props
    },
  ) {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <ThemeProvider theme={muiTheme}>
          <div id="application-view">
            <NavBar authenticated={authenticated} />
            <div id="main-container" className="container">
              {props.children}
            </div>
            <Footer version={version} />
          </div>
        </ThemeProvider>
      </MuiThemeProvider>
    );
  }

  return ApplicationView;
};
