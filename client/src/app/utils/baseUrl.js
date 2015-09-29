'use strict';
import config from 'config';

export default function( url ) {
    var fullUrl = config.baseUrl +  url;

    return fullUrl;
}
