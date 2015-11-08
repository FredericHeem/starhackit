import _ from 'lodash';
import config from 'config';
import ga from 'react-ga';
import Debug from 'debug';

let debug = new Debug("ga");

let analytics = _.get( config, 'analytics.google' );

if ( analytics ) {
    debug("enabled");
    ga.initialize( analytics );
    ga.event( {
        category: 'User',
        action: 'Visit'
    } );
} else {
    debug("not enabled");
}
