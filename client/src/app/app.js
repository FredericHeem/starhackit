
//load CSS assets first
require( '../assets/main.css' );

//import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';
//import ga from 'react-ga';

//import config from 'config';
import routes from './routes';

import Debug from 'debug';
Debug.enable("*,-engine*,-socker*");

let debug = new Debug("app");

debug("begins");
///////////////////
/// INITIALISE
/*
let analytics = _.get( config, 'analytics.google' );

if ( analytics ) {
    ga.initialize( analytics );
}
*/

Reflux.setPromiseFactory( require( 'when' ).promise );

/*
  if ( analytics ) {
      ga.pageview( state.pathname );
  }
*/

Router.run( routes, Router.HistoryLocation, function ( Handler, state ) {

    React.render( <Handler/>, document.getElementById( 'application' ) );
} );
