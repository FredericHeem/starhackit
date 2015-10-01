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

export function loginLocal( username, password ) {
    return when(
        post( baseUrl( 'auth/login' ), {
            params: {
                username,
                password
            }
        } )
    );
}

export function logout() {
    return when(
        post( baseUrl( 'auth/logout' ) )
    );
}
