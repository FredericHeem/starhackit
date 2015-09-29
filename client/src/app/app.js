/*global FB*/

//load CSS assets first
require( '../assets/main.css' );

//import _ from 'lodash';
import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';
//import ga from 'react-ga';

//import config from 'config';
import routes from './routes';

///////////////////
/// INITIALISE
/*
let analytics = _.get( config, 'analytics.google' );

if ( analytics ) {
    ga.initialize( analytics );
}
*/
/*
FB.init( {
    appId: config.auth.facebookClientId,
    cookie: true,
    version: 'v2.4',
    xfbml: true
} );
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
