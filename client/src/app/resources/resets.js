import when from 'when';

import { post } from 'utils/http';
import baseUrl from 'utils/baseUrl';

export function requestPasswordReset( email ) {
    return when(
        post( baseUrl( 'auth/reset_password' ), {
            params: {
                email
            }
        } )
    );
}

export function verifyCode( token, password) {
    return when(
        post( baseUrl( 'auth/verify_reset_password_token' ), {
            params: {
                token,
                password
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
