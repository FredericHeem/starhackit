'use strict';

import config from 'config';

export default function( url ) {
    var fullUrl = location.origin + config.apiUrl +  url;

    return fullUrl;
}
