import when from 'when';

import { post } from 'utils/http';
import baseUrl from 'utils/baseUrl';

export function requestPasswordReset( email ) {
    return when(
        post( baseUrl( 'resets/request-reset' ), {
            params: {
                email
            }
        } )
    );
}

export function verifyCode( token, code ) {
    return when(
        post( baseUrl( 'resets/verify' ), {
            params: {
                token,
                code
            }
        } )
    );
}

export function resetPassword( token, code, password ) {
    return when(
        post( baseUrl( 'resets/reset-password' ), {
            params: {
                token,
                code,
                password
            }
        } )
    );
}