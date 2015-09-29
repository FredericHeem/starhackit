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

export function getMyRecipes() {
    return when(
        get( baseUrl( 'me/recipes' ) )
    );
}

export function getMyFavouriteRecipes() {
    return when(
        get( baseUrl( 'me/favourite/recipes' ) )
    );
}

export function getComments() {
    return when(
        get( baseUrl( 'me/comments' ) )
    );
}

export function addRecipeToFavourites( recipe ) {
    return when(
        put( baseUrl( `me/favourite/recipes/${recipe.id}` ) )
    );
}

export function removeRecipeFromFavourites( recipe ) {
    return when(
        del( baseUrl( `me/favourite/recipes/${recipe.id}` ) )
    );
}

export function getMyUserNotifications() {
    return when(
        get( baseUrl( 'me/notifications' ) )
    );
}

export function dismissNotification( notification ) {
    return when(
        put( baseUrl( `me/notifications/${notification.id}` ), {
                params: {
                    read: true
                }
            }
        )
    );
}

export function getMyFriends() {
    return when(
        get( baseUrl( `me/friends` ) )
    );
}

export function getMyFriendsRecipes() {
    return when(
        get( baseUrl( `me/friends/recipes` ) )
    );
}

export function addFriend( targetUser ) {
    return when(
        post( baseUrl( `me/friends/${targetUser.id}` ) )
    );
}

export function getMyStatusUpdates() {
    return when(
        get( baseUrl( 'me/status-updates' ) )
    );
}