

import config from 'config';

if (!window.location.origin) {
    window.location.origin = `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`;
}

export default function(url) {
    const fullUrl = location.origin + config.apiUrl +  url;

    return fullUrl;
}
