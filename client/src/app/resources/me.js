import when from 'when';
import {get, post} from 'utils/http';

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
