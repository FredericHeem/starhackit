import when from 'when';
import {get, patch} from 'utils/http';

import baseUrl from 'utils/baseUrl';

export function getMyProfile() {
    return when(
        get( baseUrl( 'me' ) )
    );
}

export function updateMyProfile( packet ) {
    return when(
        patch( baseUrl( 'me' ), {
            params: {
                username: packet.username,
                about: packet.about
            }
        } )
    );
}
