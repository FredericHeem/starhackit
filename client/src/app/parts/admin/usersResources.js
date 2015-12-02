import when from 'when';
import { get } from 'utils/http';

import baseUrl from 'utils/baseUrl';

export function getUsers(data) {
    return when(
        get( baseUrl( `users/` ) )
    );
}
