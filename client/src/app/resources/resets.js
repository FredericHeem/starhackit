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

export function verifyResetPasswordToken( token, password) {
    return when(
        post( baseUrl( 'auth/verify_reset_password_token' ), {
            params: {
                token,
                password
            }
        } )
    );
}
