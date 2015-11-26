import when from 'when';
import Debug from 'debug';
let debug = new Debug("http");

export function get( url, options = {} ) {
    return ajax( url, 'GET', options );
}

export function post( url, options = {} ) {
    return ajax( url, 'POST', options );
}

export function put( url, options = {} ) {
    return ajax( url, 'PUT', options );
}

export function del( url, options = {} ) {
    return ajax( url, 'DELETE', options );
}

export function patch( url, options = {} ) {
    return ajax( url, 'PATCH', options );
}

///////////
//// PRIVATE

function ajax( url, verb, options ) {
    let ajaxData;
    debug("ajax url: %s, verb: %s, options ", url, verb, options);
    ajaxData = verb === 'GET' ? options.params : JSON.stringify( options.params );

    return when(
        $.ajax( {
            url,
            data: ajaxData,
            type: verb,
            dataType: 'json',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        } )
    );
}
