import _ from 'lodash';
import ga from 'react-ga';
import config from 'config';
import Debug from 'debug';

let debug = new Debug("analytics");

function GoogleAnalyticsMiddleware(){
  return (/* store */) => next => action => {
      const result = next(action);
      debug("action type: ", action.type);
      //TODO whitelist, blacklist
      ga.event({ category: 'Action', action: action.type });

      if (action.type === '@@router/LOCATION_CHANGE') {
          debug("pageview:", action.payload.pathname);
          ga.pageview(action.payload.pathname);
      }

      return result;
  };
}

// Part
export default function(/*{context}*/) {
    let analytics = _.get(config, 'analytics.google');
    const middlewares = [];
    if (analytics) {
        debug("enabled");
        ga.initialize( analytics );
        ga.event( {
            category: 'User',
            action: 'Visit'
        } );
        middlewares.push(GoogleAnalyticsMiddleware())
    } else {
        debug("not enabled");
    }

    return {
        middlewares
    }
}
