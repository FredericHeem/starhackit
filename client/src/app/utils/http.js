import when from 'when';

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


///////////
//// PRIVATE

function ajax( url, verb, options ) {
    let ajaxData;

    ajaxData = verb === 'GET' ? options.params : JSON.stringify( options.params );

    return when(
        $.ajax( {
            url,
            data: ajaxData,
            type: verb,
            dataType: 'json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        } )
    );
}
