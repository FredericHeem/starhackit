import when from 'when';
import { get } from 'utils/http';

import baseUrl from 'utils/baseUrl';


export function getProfile( userId ) {
    return when(
        get( baseUrl( `users/${userId}` ) )
    );
}

export function getRecipes( user ) {
    return when(
        get( baseUrl( `users/${user.id}/recipes` ) )
    );
}

export function getFriends( user ) {
    return when(
        get( baseUrl( `users/${user.id}/friends` ) )
    );
}