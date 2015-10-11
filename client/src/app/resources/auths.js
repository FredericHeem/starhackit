import when from 'when';

import { post, get } from 'utils/http';
import baseUrl from 'utils/baseUrl';

export function getCurrentUser() {
    return when(
        get( baseUrl( 'me' ) )
    );
}

export function signupOrLoginThirdParty(provider) {
    return when(
        get( baseUrl( 'auth/' +  provider))
    );
}

export function signupLocal( username, password, email ) {
    return when(
        post( baseUrl( 'auth/register' ), {
            params: {
                username,
                password,
                email
            }
        } )
    );
}

export function loginLocal( payload ) {
    return when(
        post( baseUrl( 'auth/login' ), {
            params: {
                username: payload.email,
                password: payload.password
            }
        } )
    );
}

export function logout() {
    return when(
        post( baseUrl( 'auth/logout' ) )
    );
}

export function verifyEmailCode(code) {
    return when(
        post(baseUrl('auth/verify_email_code/'), {
            params: {
                code: code
            }
        })
    );
}
