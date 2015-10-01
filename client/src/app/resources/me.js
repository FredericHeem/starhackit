import when from 'when';
import {del, get, post, put} from 'utils/http';

import baseUrl from 'utils/baseUrl';


export function getMyProfile() {
    return when(
        get( baseUrl( 'me' ) )
    );
}

export function updateMyProfile( packet ) {
    return when(
        post( baseUrl( 'me' ), {
            params: {
                name: packet.name,
                email: packet.email,
                about: packet.about
            }
        } )
    );
}
